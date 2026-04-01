// ============================================================
// TopBar — Board name, undo/redo, share, export, zoom controls
// Fixed header bar above the canvas
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import {
  Undo2,
  Redo2,
  Share2,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Magnet,
  Layers3,
  Sparkles,
  Save,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import ExportModal from "./ExportModal";
import ShareModal from "./ShareModal";
import { getApiUrl } from "@/lib/config";

// Helper to format time ago
const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return "a while ago";
};

export default function TopBar() {
  const {
    editor,
    boardTitle,
    setBoardTitle,
    zoomLevel,
    isGridVisible,
    isSnapEnabled,
    toggleGrid,
    toggleSnap,
    toggleRightSidebar,
    boardId,
    setBoardId,
  } = useCanvasStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isLocalBoard = !boardId || boardId === "local";

  // --- Undo/Redo handlers ---
  const handleUndo = () => {
    if (!editor) return;
    editor.undo();
  };

  const handleRedo = () => {
    if (!editor) return;
    editor.redo();
  };

  // --- Zoom handlers ---
  const handleZoomIn = () => {
    if (!editor) return;
    editor.zoomIn();
  };

  const handleZoomOut = () => {
    if (!editor) return;
    editor.zoomOut();
  };

  const handleZoomToFit = () => {
    if (!editor) return;
    editor.zoomToFit();
  };

  const handleResetZoom = () => {
    if (!editor) return;
    editor.resetZoom();
  };

  // --- Share ---
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // --- Export ---
  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  // --- Save Board ---
  const saveBoard = async (showToast = true) => {
    if (!editor) return false;
    if (isLocalBoard) return false;

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const snapshot = editor.store.getStoreSnapshot();
      const content = JSON.stringify(snapshot);

      const response = await fetch(getApiUrl(`/api/boards/${boardId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: boardTitle,
          content,
        }),
      });

      if (response.ok) {
        setSaveStatus("saved");
        setLastSaved(new Date());
        if (showToast) {
          toast.success("Board saved!");
        }
        return true;
      } else {
        setSaveStatus("unsaved");
        if (showToast) {
          toast.error("Failed to save board");
        }
        return false;
      }
    } catch (error) {
      console.error("Failed to save board:", error);
      setSaveStatus("unsaved");
      if (showToast) {
        toast.error("Failed to save board");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBoard = async () => {
    if (isLocalBoard) {
      // Create new board
      if (!editor) return;

      setIsSaving(true);
      try {
        const snapshot = editor.store.getStoreSnapshot();
        const content = JSON.stringify(snapshot);

        const response = await fetch(getApiUrl("/api/boards"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: boardTitle,
            content,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setBoardId(data._id);
          // Update URL without reload
          window.history.pushState({}, "", `/board/${data._id}`);
          setSaveStatus("saved");
          setLastSaved(new Date());
          toast.success("Board saved successfully!");
        } else {
          toast.error("Failed to save board");
        }
      } catch (error) {
        console.error("Failed to save board:", error);
        toast.error("Failed to save board");
      } finally {
        setIsSaving(false);
      }
    } else {
      // Update existing board
      await saveBoard(true);
    }
  };

  // Autosave - save every 30 seconds if there are changes
  useEffect(() => {
    if (!editor || isLocalBoard || !boardId) return;

    let hasChanges = false;
    let autoSaveTimer: NodeJS.Timeout;

    // Listen for changes
    const unsubscribe = editor.store.listen(() => {
      hasChanges = true;
      setSaveStatus("unsaved");

      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      // Set new timer for 30 seconds
      autoSaveTimer = setTimeout(() => {
        if (hasChanges) {
          saveBoard(false); // Silent autosave
          hasChanges = false;
        }
      }, 30000); // 30 seconds
    }, { source: "user" });

    return () => {
      unsubscribe();
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [editor, isLocalBoard, boardId]);

  // Save on title change
  useEffect(() => {
    if (!isLocalBoard && boardId) {
      const timer = setTimeout(() => {
        saveBoard(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [boardTitle, isLocalBoard, boardId]);

  // Keyboard shortcut: Ctrl+S / Cmd+S for manual save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveBoard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocalBoard, boardId, editor, boardTitle]);

  return (
    <>
      <div className="topbar glass">
      {/* Left section: Logo + Board Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        {/* App Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingRight: 12,
            borderRight: "1px solid var(--border-default)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background:
                "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              background:
                "linear-gradient(135deg, var(--accent-primary), #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            AI Canvas
          </span>
        </div>

        {/* Editable Board Title */}
        {isEditingTitle ? (
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingTitle(false);
            }}
            autoFocus
            style={{
              background: "var(--bg-hover)",
              border: "1px solid var(--border-accent)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontWeight: 500,
              padding: "4px 10px",
              outline: "none",
              width: 220,
              fontFamily: "Inter, sans-serif",
            }}
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              transition: "background var(--transition-fast)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {boardTitle}
          </button>
        )}
      </div>

      {/* Center section: Undo/Redo + Grid/Snap toggles */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <button className="tool-button" onClick={handleUndo} aria-label="Undo">
          <Undo2 size={16} />
        </button>
        <button className="tool-button" onClick={handleRedo} aria-label="Redo">
          <Redo2 size={16} />
        </button>

        <div className="divider" />

        <button
          className={`tool-button ${isGridVisible ? "active" : ""}`}
          onClick={toggleGrid}
          aria-label="Toggle grid"
        >
          <Grid3X3 size={16} />
        </button>
        <button
          className={`tool-button ${isSnapEnabled ? "active" : ""}`}
          onClick={toggleSnap}
          aria-label="Toggle snap"
        >
          <Magnet size={16} />
        </button>
      </div>

      {/* Right section: Zoom + Share + Export + Properties */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        {/* Zoom controls */}
        <button
          className="tool-button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>

        <button
          onClick={handleResetZoom}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)",
            minWidth: 52,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
          }}
          aria-label="Reset zoom"
        >
          {Math.round(zoomLevel * 100)}%
        </button>

        <button
          className="tool-button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>

        <button
          className="tool-button"
          onClick={handleZoomToFit}
          aria-label="Zoom to fit"
        >
          <Maximize2 size={16} />
        </button>

        <div className="divider" />

        {/* Save button */}
        {isLocalBoard ? (
          // Create new board button
          <button
            className="tool-button"
            onClick={handleSaveBoard}
            disabled={isSaving}
            aria-label="Save board"
            title="Save board (Ctrl+S)"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
            ) : (
              <Save size={16} style={{ color: "var(--accent-primary)" }} />
            )}
          </button>
        ) : (
          // Save status indicator + manual save button
          <button
            className="tool-button"
            onClick={handleSaveBoard}
            disabled={isSaving}
            aria-label="Save board"
            title={
              saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                ? `Saved ${lastSaved ? formatTimeAgo(lastSaved) : ""} (Click to save now)`
                : "Unsaved changes (Click to save)"
            }
          >
            {saveStatus === "saving" ? (
              <Loader2 size={16} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
            ) : saveStatus === "saved" ? (
              <Check size={16} style={{ color: "#10b981" }} />
            ) : (
              <Save size={16} style={{ color: "var(--text-tertiary)" }} />
            )}
          </button>
        )}

        <div className="divider" />

        {/* Share button */}
        <button
          className="tool-button"
          onClick={handleShare}
          aria-label="Share board"
        >
          <Share2 size={16} />
        </button>

        {/* Export button */}
        <button
          className="tool-button"
          onClick={handleExport}
          aria-label="Export board"
        >
          <Download size={16} />
        </button>

        <div className="divider" />

        {/* Properties panel toggle */}
        <button
          className="tool-button"
          onClick={toggleRightSidebar}
          aria-label="Toggle properties panel"
        >
          <Layers3 size={16} />
        </button>
      </div>
    </div>

      {/* Modals */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        boardId={boardId || "local"}
      />
    </>
  );
}
