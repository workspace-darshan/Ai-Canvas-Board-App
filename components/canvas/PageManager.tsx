// ============================================================
// PageManager — Multi-page canvas support
// Shows page tabs at the bottom-left of the canvas
// ============================================================

"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { Plus, FileText, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function PageManager() {
  const { editor, pages, activePageId, setPages, setActivePageId, addPage } =
    useCanvasStore();
  const [isExpanded, setIsExpanded] = useState(false);

  /** Create a new page */
  const handleAddPage = () => {
    if (!editor) return;

    const pageCount = pages.length;
    if (pageCount >= 10) {
      toast.warning("Maximum 10 pages per board");
      return;
    }

    const newPageName = `Page ${pageCount + 1}`;
    const newPageId = `page:${Date.now()}`;

    // Create page in tldraw
    editor.createPage({ name: newPageName, id: newPageId as never });

    // Update our store
    addPage({ id: newPageId, name: newPageName });

    // Switch to the new page
    editor.setCurrentPage(newPageId as never);
    setActivePageId(newPageId);

    toast.success(`Created ${newPageName}`);
  };

  /** Switch to a page */
  const handleSwitchPage = (pageId: string) => {
    if (!editor) return;
    editor.setCurrentPage(pageId as never);
    setActivePageId(pageId);
    setIsExpanded(false);
  };

  /** Delete a page */
  const handleDeletePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor) return;

    if (pages.length <= 1) {
      toast.warning("Cannot delete the last page");
      return;
    }

    // Switch to another page first
    const remainingPages = pages.filter((p) => p.id !== pageId);
    const nextPage = remainingPages[0];
    editor.setCurrentPage(nextPage.id as never);
    setActivePageId(nextPage.id);

    // Delete from tldraw
    editor.deletePage(pageId as never);

    // Update store
    setPages(remainingPages);

    toast.success("Page deleted");
  };

  const currentPage = pages.find((p) => p.id === activePageId);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: 12,
        zIndex: 50,
      }}
    >
      {/* Expanded page list */}
      {isExpanded && (
        <div
          className="glass animate-fade-in"
          style={{
            marginBottom: 6,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            minWidth: 180,
          }}
        >
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handleSwitchPage(page.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                background:
                  page.id === activePageId
                    ? "var(--accent-subtle)"
                    : "transparent",
                border: "none",
                borderBottom: "1px solid var(--border-subtle)",
                color:
                  page.id === activePageId
                    ? "var(--accent-primary)"
                    : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <FileText size={14} />
              <span style={{ flex: 1, textAlign: "left" }}>{page.name}</span>
              {pages.length > 1 && (
                <span
                  onClick={(e) => handleDeletePage(page.id, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    borderRadius: "var(--radius-sm)",
                    opacity: 0.5,
                    transition: "opacity var(--transition-fast)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.opacity = "0.5")
                  }
                >
                  <X size={12} />
                </span>
              )}
            </button>
          ))}

          {/* Add page button */}
          <button
            onClick={handleAddPage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "8px 12px",
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-tertiary)")
            }
          >
            <Plus size={14} />
            Add Page
          </button>
        </div>
      )}

      {/* Current page indicator / toggle */}
      <button
        className="glass glass-hover"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
          background: "rgba(22, 22, 30, 0.85)",
          color: "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <FileText size={14} />
        {currentPage?.name || "Page 1"}
        <ChevronDown
          size={14}
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--transition-fast)",
          }}
        />
      </button>
    </div>
  );
}
