// ============================================================
// TopBar — Board name, undo/redo, share, export, zoom controls
// Fixed header bar above the canvas
// ============================================================

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  MoreVertical,
  Home,
  Copy,
  Trash2,
  FileText,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
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

interface TopBarProps {
  activeUsers?: Array<{
    id: string;
    name: string;
    image?: string;
    color: string;
  }>;
}

export default function TopBar({ activeUsers = [] }: TopBarProps) {
  const router = useRouter();
  const { data: session } = useSession();
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const collaboratorsRef = useRef<HTMLDivElement>(null);

  const isLocalBoard = !boardId || boardId === "local";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (collaboratorsRef.current && !collaboratorsRef.current.contains(event.target as Node)) {
        setShowCollaborators(false);
      }
    };

    if (isMenuOpen || showCollaborators) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, showCollaborators]);

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
  const generateThumbnail = async (): Promise<string> => {
    if (!editor) return "";
    
    try {
      const shapeIds = Array.from(editor.getCurrentPageShapeIds());
      
      if (shapeIds.length === 0) {
        return "";
      }

      // Export as SVG and convert to image
      const svg = await editor.getSvgString(shapeIds, {
        background: true,
        darkMode: true,
      });

      if (!svg) return "";

      // Create canvas for thumbnail
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      canvas.width = 320;
      canvas.height = 180;

      // Fill background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to image (without loading external resources)
      const svgBlob = new Blob([svg.svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      return new Promise((resolve) => {
        const img = new Image();
        
        // Set a timeout in case image fails to load
        const timeout = setTimeout(() => {
          URL.revokeObjectURL(url);
          // Return gradient fallback
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, "rgba(79, 110, 247, 0.1)");
          gradient.addColorStop(1, "rgba(168, 85, 247, 0.1)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png", 0.8));
        }, 2000);

        img.onload = () => {
          clearTimeout(timeout);
          
          // Calculate scaling
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;

          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL("image/png", 0.8));
        };

        img.onerror = () => {
          clearTimeout(timeout);
          URL.revokeObjectURL(url);
          // Return gradient fallback
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, "rgba(79, 110, 247, 0.1)");
          gradient.addColorStop(1, "rgba(168, 85, 247, 0.1)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png", 0.8));
        };

        img.src = url;
      });
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
      return "";
    }
  };

  const saveBoard = async (showToast = true) => {
    if (!editor) return false;
    if (isLocalBoard) return false;

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const snapshot = editor.store.getStoreSnapshot();
      const content = JSON.stringify(snapshot);

      // Generate thumbnail
      const thumbnail = await generateThumbnail();

      const response = await fetch(getApiUrl(`/api/boards/${boardId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: boardTitle,
          content,
          thumbnail,
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

        // Generate thumbnail
        const thumbnail = await generateThumbnail();

        const userId = (session?.user as any)?.id;

        const response = await fetch(getApiUrl("/api/boards"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: boardTitle,
            content,
            thumbnail,
            owner: userId,
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
      // Ctrl+Alt+D for Dashboard
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === "d") {
        e.preventDefault();
        router.push("/dashboard");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocalBoard, boardId, editor, boardTitle]);

  const handleDuplicateBoard = async () => {
    if (!editor || isLocalBoard) return;

    setIsMenuOpen(false);
    try {
      const snapshot = editor.store.getStoreSnapshot();
      const content = JSON.stringify(snapshot);

      const response = await fetch(getApiUrl("/api/boards"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${boardTitle} (Copy)`,
          content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Board duplicated!");
        router.push(`/board/${data._id}`);
      } else {
        toast.error("Failed to duplicate board");
      }
    } catch (error) {
      console.error("Failed to duplicate board:", error);
      toast.error("Failed to duplicate board");
    }
  };

  const handleDeleteBoard = async () => {
    if (!boardId || isLocalBoard) return;

    if (!confirm("Are you sure you want to delete this board?")) return;

    setIsMenuOpen(false);
    try {
      const response = await fetch(getApiUrl(`/api/boards/${boardId}`), {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Board deleted");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete board");
      }
    } catch (error) {
      console.error("Failed to delete board:", error);
      toast.error("Failed to delete board");
    }
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      <div className="topbar glass">
        {/* Left section: Logo + Board Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          {/* App Logo */}
          <div
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingRight: 12,
              borderRight: "1px solid var(--border-default)",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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

            {/* Menu Button */}
            <div style={{ position: "relative" }} ref={menuRef}>
              <button
                className="tool-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
                style={{ marginLeft: 4 }}
              >
                <MoreVertical size={16} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    width: 200,
                    background: "#202025",
                    border: "1px solid #33333d",
                    borderRadius: 5,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    zIndex: 1000,
                    animation: "fadeIn 0.15s ease-out",
                  }}
                >
                  <div
                    style={{ padding: "5px", }}>
                    {/* Dashboard */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/dashboard");
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 7px",
                        background: "transparent",
                        border: "none",
                        borderRadius: 6,
                        color: "#d9d9d9",
                        fontSize: 12,
                        fontWeight: 400,
                        cursor: "pointer",
                        transition: "background 0.1s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Home size={16} strokeWidth={1.3} />
                        <span>Dashboard</span>
                      </div>
                      <span style={{ fontSize: 12, color: "#6a6a72" }}>
                        Ctrl+Alt+D
                      </span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: 1,
                    background: "#33333d",
                    margin: "0",
                  }} />

                  {/* Rename */}
                  <div
                    style={{ padding: "5px 5px 0 5px", }}>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsEditingTitle(true);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 7px",
                        background: "transparent",
                        border: "none",
                        borderRadius: 6,
                        color: "#b0b0b8",
                        fontSize: 12,
                        fontWeight: 400,
                        cursor: "pointer",
                        transition: "background 0.1s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <FileText size={16} strokeWidth={1.3} />
                      <span>Rename</span>
                    </button>
                  </div>

                  {/* Duplicate */}
                  {!isLocalBoard && (
                    <div
                      style={{ padding: "0 5px", }}>
                      <button
                        onClick={handleDuplicateBoard}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "9px 7px",
                          background: "transparent",
                          border: "none",
                          borderRadius: 6,
                          color: "#b0b0b8",
                          fontSize: 12,
                          fontWeight: 400,
                          cursor: "pointer",
                          transition: "background 0.1s",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Copy size={16} strokeWidth={1.3} />
                          <span>Duplicate</span>
                        </div>
                        <span style={{ fontSize: 12, color: "#6a6a72" }}>
                          Ctrl+D
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Delete */}
                  {!isLocalBoard && (
                    <div
                      style={{ padding: "0px 5px 5px 5px", }}>
                      <button
                        onClick={handleDeleteBoard}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "9px 7px",
                          background: "transparent",
                          border: "none",
                          borderRadius: 6,
                          color: "#e57373",
                          fontSize: 12,
                          fontWeight: 400,
                          cursor: "pointer",
                          transition: "background 0.1s",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229, 115, 115, 0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <Trash2 size={16} strokeWidth={1.3} />
                        <span>Delete Board</span>
                      </button>
                    </div>
                  )}

                  {/* Divider */}
                  <div style={{
                    height: 1,
                    background: "#33333d",
                    margin: "0",
                  }} />

                  <div
                    style={{ padding: "5px", }}>
                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 7px",
                        background: "transparent",
                        border: "none",
                        borderRadius: 6,
                        color: "#d9d9d9",
                        fontSize: 12,
                        fontWeight: 400,
                        cursor: "pointer",
                        transition: "background 0.1s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={16} strokeWidth={1.3} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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

        {/* Right section: Zoom + Share + Export + Properties + User Profile */}
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

          <div className="divider" />

          {/* Collaborators Indicator */}
          <div style={{ position: "relative" }} ref={collaboratorsRef}>
            <button
              className="tool-button"
              onClick={() => setShowCollaborators(!showCollaborators)}
              aria-label="Show collaborators"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginLeft: -4 }}>
                {activeUsers.slice(0, 3).map((user, index) => (
                  <div
                    key={index}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "2px solid var(--bg-elevated)",
                      marginLeft: index > 0 ? -8 : 0,
                      zIndex: 10 - index,
                      overflow: "hidden",
                      background: user.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#ffffff",
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {activeUsers.length > 3 && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}>
                  +{activeUsers.length - 3}
                </span>
              )}
            </button>

            {/* Collaborators Dropdown */}
            {showCollaborators && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 240,
                  background: "#202025",
                  border: "1px solid #33333d",
                  borderRadius: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  padding: "8px",
                  zIndex: 1000,
                }}
              >
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b6b80",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "8px 8px 4px",
                }}>
                  Active Users ({activeUsers.length})
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {activeUsers.map((user, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px",
                        borderRadius: 6,
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: user.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#ffffff",
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#ffffff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {user.name}
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: "#6b6b80",
                        }}>
                          {index === 0 ? "Editing now" : "Viewing"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {session?.user && (
            <>
              <div className="divider" />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-hover)",
                  cursor: "pointer",
                  transition: "background var(--transition-fast)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onClick={() => router.push("/dashboard")}
                title="Go to Dashboard"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4f6ef7, #a855f7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {session.user.name}
                </span>
              </div>
            </>
          )}
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
