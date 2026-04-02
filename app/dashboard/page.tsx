"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles, LogOut, Loader2, Plus, Search,
  Grid, List, Clock, Star, Trash2, MoreVertical,
  Folder, Users, FileText
} from "lucide-react";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/config";

interface Board {
  _id: string;
  title: string;
  thumbnail?: string;
  updatedAt: string;
  createdAt: string;
  owner: string;
  isPublic: boolean;
  content?: string;
  isStarred?: boolean;
  isTrashed?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [draftsCount, setDraftsCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "drafts" | "starred" | "trash">("all");

  useEffect(() => {
    if (session?.user && (session.user as any).id) {
      fetchBoards();
    }
  }, [session]);

  const fetchBoards = async () => {
    try {
      const userId = (session?.user as any)?.id;
      if (!userId) return;

      const response = await fetch(
        getApiUrl(`/api/boards?userId=${userId}`)
      );
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
        const drafts = data.filter((b: Board) =>
          b.title === "Untitled Board" || b.content === "{}"
        );
        setDraftsCount(drafts.length);
      }
    } catch (error) {
      console.error("Failed to fetch boards:", error);
      toast.error("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const createNewBoard = async () => {
    try {
      const userId = (session?.user as any)?.id;
      if (!userId) return;

      const response = await fetch(getApiUrl("/api/boards"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Board",
          owner: userId,
          content: "{}",
        }),
      });

      if (response.ok) {
        const newBoard = await response.json();
        router.push(`/board/${newBoard._id}`);
      }
    } catch (error) {
      toast.error("Failed to create board");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const filteredBoards = boards.filter((board) => {
    // Filter by search query
    if (searchQuery && !board.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by active sidebar filter
    if (activeFilter === "trash") {
      // Only show trashed boards in trash
      return board.isTrashed === true;
    }

    // For all other filters, exclude trashed boards
    if (board.isTrashed) return false;

    if (activeFilter === "starred" && !board.isStarred) return false;
    if (activeFilter === "drafts" && board.title !== "Untitled Board" && board.content !== "{}") return false;

    return true;
  });

  const draftBoards = filteredBoards.filter((board) =>
    board.title === "Untitled Board" || !board.content || board.content === "{}"
  );

  const regularBoards = filteredBoards.filter((board) =>
    board.title !== "Untitled Board" && board.content && board.content !== "{}"
  );

  const BoardCard = ({ board }: { board: Board }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(board.title);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setMenuOpen(false);
        }
      };

      if (menuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [menuOpen]);

    const handleToggleStarred = async (e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        const response = await fetch(getApiUrl(`/api/boards/${board._id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isStarred: !board.isStarred }),
        });

        if (response.ok) {
          toast.success(board.isStarred ? "Removed from starred" : "Added to starred");
          fetchBoards();
        } else {
          toast.error("Failed to update board");
        }
      } catch (error) {
        toast.error("Failed to update board");
      }
      setMenuOpen(false);
    };

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        if (board.isTrashed) {
          // Permanent delete if already in trash
          const response = await fetch(getApiUrl(`/api/boards/${board._id}`), {
            method: "DELETE",
          });

          if (response.ok) {
            toast.success("Board permanently deleted");
            fetchBoards();
          } else {
            toast.error("Failed to delete board");
          }
        } else {
          // Soft delete - move to trash
          const response = await fetch(getApiUrl(`/api/boards/${board._id}`), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isTrashed: true }),
          });

          if (response.ok) {
            toast.success("Board moved to trash");
            fetchBoards();
          } else {
            toast.error("Failed to move board to trash");
          }
        }
      } catch (error) {
        toast.error("Failed to delete board");
      }
      setMenuOpen(false);
    };

    const handleRestore = async (e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        const response = await fetch(getApiUrl(`/api/boards/${board._id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isTrashed: false }),
        });

        if (response.ok) {
          toast.success("Board restored");
          fetchBoards();
        } else {
          toast.error("Failed to restore board");
        }
      } catch (error) {
        toast.error("Failed to restore board");
      }
      setMenuOpen(false);
    };

    const handleRename = async () => {
      if (newTitle === board.title) {
        setIsRenaming(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl(`/api/boards/${board._id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        });

        if (response.ok) {
          toast.success("Board renamed");
          fetchBoards();
        } else {
          toast.error("Failed to rename board");
        }
      } catch (error) {
        toast.error("Failed to rename board");
      }
      setIsRenaming(false);
    };

    return (
      <div
        style={{
          background: "#13131c",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          transition: "all 0.2s",
          display: viewMode === "list" ? "flex" : "block",
          gap: viewMode === "list" ? 16 : 0,
          position: "relative",
        }}
      >
        <div
          onClick={() => router.push(`/board/${board._id}`)}
          style={{
            height: viewMode === "grid" ? 160 : 80,
            width: viewMode === "list" ? 128 : "auto",
            flexShrink: viewMode === "list" ? 0 : undefined,
            background: board.thumbnail
              ? `url(${board.thumbnail}) center/cover`
              : "linear-gradient(135deg, rgba(79, 110, 247, 0.1), rgba(168, 85, 247, 0.1))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderTopLeftRadius: viewMode === "grid" ? 12 : 0,
            borderBottomLeftRadius: viewMode === "list" ? 12 : 0,
            borderTopRightRadius: viewMode === "grid" ? 12 : 0,
            overflow: "hidden",
          }}
        >
          {!board.thumbnail && (
            <Sparkles size={32} style={{ color: "#4f6ef7", opacity: 0.3 }} />
          )}
        </div>
        <div style={{ padding: 16, flex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}>
            {isRenaming ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setNewTitle(board.title);
                    setIsRenaming(false);
                  }
                }}
                autoFocus
                style={{
                  flex: 1,
                  background: "#0d0d14",
                  border: "1px solid rgba(79, 110, 247, 0.3)",
                  borderRadius: 4,
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "4px 8px",
                  outline: "none",
                }}
              />
            ) : (
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#ffffff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}>
                {board.title}
              </h3>
            )}
            <div style={{ position: "relative" }} ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b6b80",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0b8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b80")}
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    width: 160,
                    background: "#202025",
                    border: "1px solid #33333d",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    padding: "6px",
                    zIndex: 10000,
                  }}
                >
                  {!board.isTrashed && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          setIsRenaming(true);
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
                        <FileText size={16} strokeWidth={1.5} />
                        <span>Rename</span>
                      </button>

                      <button
                        onClick={handleToggleStarred}
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
                        <Star size={16} strokeWidth={1.5} fill={board.isStarred ? "#fbbf24" : "none"} style={{ color: board.isStarred ? "#fbbf24" : "#b0b0b8" }} />
                        <span>{board.isStarred ? "Unstar" : "Star"}</span>
                      </button>
                    </>
                  )}

                  {board.isTrashed && (
                    <button
                      onClick={handleRestore}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 7px",
                        background: "transparent",
                        border: "none",
                        borderRadius: 6,
                        color: "#10b981",
                        fontSize: 12,
                        fontWeight: 400,
                        cursor: "pointer",
                        transition: "background 0.1s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <FileText size={16} strokeWidth={1.5} />
                      <span>Restore</span>
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
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
                    <Trash2 size={16} strokeWidth={1.5} />
                    <span>{board.isTrashed ? "Delete Forever" : "Delete"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <p style={{
            fontSize: 12,
            color: "#6b6b80",
          }}>
            Updated {new Date(board.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090f",
      }}>
        <div style={{ position: "relative", marginBottom: 24 }}>
          <div style={{
            width: 64,
            height: 64,
            border: "4px solid rgba(79, 110, 247, 0.2)",
            borderTop: "4px solid #4f6ef7",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}></div>
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Sparkles size={24} style={{ color: "#4f6ef7" }} />
          </div>
        </div>
        <p style={{
          fontSize: 14,
          color: "#6b6b80",
          fontWeight: 500,
        }}>
          Loading your boards...
        </p>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090f",
      display: "flex",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "#0d0d14",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
      }}>
        {/* Logo */}
        <div style={{
          padding: "0 20px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #7c5cfc, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
            AI Canvas
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          <button
            onClick={() => setActiveFilter("all")}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: activeFilter === "all" ? "rgba(79, 110, 247, 0.1)" : "transparent",
              color: activeFilter === "all" ? "#4f6ef7" : "#6b6b80",
              fontSize: 14,
              fontWeight: activeFilter === "all" ? 600 : 500,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== "all") {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#a0a0b8";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== "all") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6b6b80";
              }
            }}
          >
            <Grid size={18} />
            All Boards
          </button>

          <button
            onClick={() => setActiveFilter("recent")}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: activeFilter === "recent" ? "rgba(79, 110, 247, 0.1)" : "transparent",
              color: activeFilter === "recent" ? "#4f6ef7" : "#6b6b80",
              fontSize: 14,
              fontWeight: activeFilter === "recent" ? 600 : 500,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== "recent") {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#a0a0b8";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== "recent") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6b6b80";
              }
            }}
          >
            <Clock size={18} />
            Recent
          </button>

          <button
            onClick={() => setActiveFilter("drafts")}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: activeFilter === "drafts" ? "rgba(79, 110, 247, 0.1)" : "transparent",
              color: activeFilter === "drafts" ? "#4f6ef7" : "#6b6b80",
              fontSize: 14,
              fontWeight: activeFilter === "drafts" ? 600 : 500,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== "drafts") {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#a0a0b8";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== "drafts") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6b6b80";
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Folder size={18} />
              Drafts
            </div>
            {draftsCount > 0 && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: activeFilter === "drafts" ? "#4f6ef7" : "#6b6b80",
                background: "rgba(255,255,255,0.05)",
                padding: "2px 6px",
                borderRadius: 4,
              }}>
                {draftsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("starred")}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: activeFilter === "starred" ? "rgba(79, 110, 247, 0.1)" : "transparent",
              color: activeFilter === "starred" ? "#4f6ef7" : "#6b6b80",
              fontSize: 14,
              fontWeight: activeFilter === "starred" ? 600 : 500,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== "starred") {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#a0a0b8";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== "starred") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6b6b80";
              }
            }}
          >
            <Star size={18} />
            Starred
          </button>

          <button
            onClick={() => setActiveFilter("trash")}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: activeFilter === "trash" ? "rgba(79, 110, 247, 0.1)" : "transparent",
              color: activeFilter === "trash" ? "#4f6ef7" : "#6b6b80",
              fontSize: 14,
              fontWeight: activeFilter === "trash" ? 600 : 500,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== "trash") {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#a0a0b8";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== "trash") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6b6b80";
              }
            }}
          >
            <Trash2 size={18} />
            Trash
          </button>

          <div style={{
            height: 1,
            background: "rgba(255,255,255,0.08)",
            margin: "16px 0",
          }} />

          <button style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            background: "transparent",
            color: "#6b6b80",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#a0a0b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6b6b80";
            }}>
            <Users size={18} />
            Shared with me
          </button>
        </nav>

        {/* User Profile */}
        <div style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f6ef7, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#ffffff",
              }}>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {session?.user?.name}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              background: "none",
              border: "none",
              color: "#6b6b80",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0b8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b80")}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <header style={{
          height: 64,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          justifyContent: "space-between",
        }}>
          {/* Search */}
          <div style={{
            flex: 1,
            maxWidth: 400,
            position: "relative",
          }}>
            <Search size={16} style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b6b80",
            }} />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                background: "#13131c",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                color: "#ffffff",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {/* View Toggle & New Board */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              display: "flex",
              background: "#13131c",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: 2,
            }}>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "6px 12px",
                  background: viewMode === "grid" ? "rgba(79, 110, 247, 0.1)" : "transparent",
                  border: "none",
                  borderRadius: 6,
                  color: viewMode === "grid" ? "#4f6ef7" : "#6b6b80",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  padding: "6px 12px",
                  background: viewMode === "list" ? "rgba(79, 110, 247, 0.1)" : "transparent",
                  border: "none",
                  borderRadius: 6,
                  color: viewMode === "list" ? "#4f6ef7" : "#6b6b80",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <List size={16} />
              </button>
            </div>

            <button
              onClick={createNewBoard}
              style={{
                padding: "8px 16px",
                background: "#4f6ef7",
                border: "none",
                borderRadius: 8,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5b7ef8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4f6ef7")}
            >
              <Plus size={16} />
              New Board
            </button>
          </div>
        </header>

        {/* Boards Grid/List */}
        <div style={{
          flex: 1,
          padding: 32,
          overflowY: "auto",
        }}>
          {!searchQuery ? (
            <>
              {/* Page Title based on active filter */}
              {activeFilter === "all" && (
                <>
                  {/* Drafts Section */}
                  <section style={{ marginBottom: 40 }}>
                    <h2 style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#ffffff",
                      marginBottom: 20,
                    }}>
                      Drafts
                    </h2>
                    <div style={{
                      display: viewMode === "grid" ? "grid" : "flex",
                      gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                      flexDirection: viewMode === "list" ? "column" : undefined,
                      gap: 20,
                    }}>
                      {/* Create New Board Card */}
                      {viewMode === "grid" && (
                        <button
                          onClick={createNewBoard}
                          style={{
                            background: "#13131c",
                            border: "2px dashed rgba(255,255,255,0.15)",
                            borderRadius: 8,
                            padding: "30px 20px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "rgba(79, 110, 247, 0.5)";
                            e.currentTarget.style.background = "rgba(79, 110, 247, 0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                            e.currentTarget.style.background = "#13131c";
                          }}
                        >
                          <div style={{
                            width: 64,
                            height: 34,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "10px",
                          }}>
                            <Plus size={48} style={{ color: "#6b6b80", strokeWidth: 1.5 }} />
                          </div>
                          <p style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#a0a0b8",
                          }}>
                            Create a Blank File
                          </p>
                        </button>
                      )}

                      {/* Draft Boards */}
                      {draftBoards.map((board) => (
                        <BoardCard key={board._id} board={board} />
                      ))}
                    </div>
                  </section>

                  {/* Regular Boards Section */}
                  {regularBoards.length > 0 && (
                    <section>
                      <h2 style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#ffffff",
                        marginBottom: 20,
                      }}>
                        All Boards
                      </h2>
                      <div style={{
                        display: viewMode === "grid" ? "grid" : "flex",
                        gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                        flexDirection: viewMode === "list" ? "column" : undefined,
                        gap: 20,
                      }}>
                        {regularBoards.map((board) => (
                          <BoardCard key={board._id} board={board} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}

              {activeFilter === "recent" && (
                <section>
                  <h2 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 8,
                  }}>
                    Recent Boards
                  </h2>
                  <p style={{
                    fontSize: 14,
                    color: "#6b6b80",
                    marginBottom: 24,
                  }}>
                    Boards you've recently worked on
                  </p>
                  <div style={{
                    display: viewMode === "grid" ? "grid" : "flex",
                    gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                    flexDirection: viewMode === "list" ? "column" : undefined,
                    gap: 20,
                  }}>
                    {filteredBoards.length > 0 ? (
                      filteredBoards.map((board) => (
                        <BoardCard key={board._id} board={board} />
                      ))
                    ) : (
                      <div style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "60px 20px",
                      }}>
                        <Clock size={48} style={{ color: "#4f6ef7", opacity: 0.3, margin: "0 auto 16px" }} />
                        <p style={{ fontSize: 14, color: "#6b6b80" }}>No recent boards</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeFilter === "drafts" && (
                <section>
                  <h2 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 8,
                  }}>
                    Drafts
                  </h2>
                  <p style={{
                    fontSize: 14,
                    color: "#6b6b80",
                    marginBottom: 24,
                  }}>
                    Untitled boards and work in progress
                  </p>
                  <div style={{
                    display: viewMode === "grid" ? "grid" : "flex",
                    gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                    flexDirection: viewMode === "list" ? "column" : undefined,
                    gap: 20,
                  }}>
                    {viewMode === "grid" && (
                      <button
                        onClick={createNewBoard}
                        style={{
                          background: "#13131c",
                          border: "2px dashed rgba(255,255,255,0.15)",
                          borderRadius: 8,
                          padding: "30px 20px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(79, 110, 247, 0.5)";
                          e.currentTarget.style.background = "rgba(79, 110, 247, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                          e.currentTarget.style.background = "#13131c";
                        }}
                      >
                        <div style={{
                          width: 64,
                          height: 34,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "10px",
                        }}>
                          <Plus size={48} style={{ color: "#6b6b80", strokeWidth: 1.5 }} />
                        </div>
                        <p style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#a0a0b8",
                        }}>
                          Create a Blank File
                        </p>
                      </button>
                    )}
                    {filteredBoards.length > 0 ? (
                      filteredBoards.map((board) => (
                        <BoardCard key={board._id} board={board} />
                      ))
                    ) : (
                      <div style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "60px 20px",
                      }}>
                        <Folder size={48} style={{ color: "#4f6ef7", opacity: 0.3, margin: "0 auto 16px" }} />
                        <p style={{ fontSize: 14, color: "#6b6b80" }}>No draft boards</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeFilter === "starred" && (
                <section>
                  <h2 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 8,
                  }}>
                    Starred Boards
                  </h2>
                  <p style={{
                    fontSize: 14,
                    color: "#6b6b80",
                    marginBottom: 24,
                  }}>
                    Your favorite boards for quick access
                  </p>
                  <div style={{
                    display: viewMode === "grid" ? "grid" : "flex",
                    gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                    flexDirection: viewMode === "list" ? "column" : undefined,
                    gap: 20,
                  }}>
                    {filteredBoards.length > 0 ? (
                      filteredBoards.map((board) => (
                        <BoardCard key={board._id} board={board} />
                      ))
                    ) : (
                      <div style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "60px 20px",
                      }}>
                        <Star size={48} style={{ color: "#4f6ef7", opacity: 0.3, margin: "0 auto 16px" }} />
                        <p style={{ fontSize: 14, color: "#6b6b80" }}>No starred boards yet</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeFilter === "trash" && (
                <section>
                  <div style={{ marginBottom: 24 }}>
                    <h2 style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: 8,
                    }}>
                      Trash
                    </h2>
                    <p style={{
                      fontSize: 14,
                      color: "#6b6b80",
                    }}>
                      Boards in trash will be automatically deleted after 30 days
                    </p>
                  </div>
                  <div style={{
                    display: viewMode === "grid" ? "grid" : "flex",
                    gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                    flexDirection: viewMode === "list" ? "column" : undefined,
                    gap: 20,
                  }}>
                    {filteredBoards.length > 0 ? (
                      filteredBoards.map((board) => (
                        <BoardCard key={board._id} board={board} />
                      ))
                    ) : (
                      <div style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "60px 20px",
                      }}>
                        <Trash2 size={48} style={{ color: "#4f6ef7", opacity: 0.3, margin: "0 auto 16px" }} />
                        <p style={{ fontSize: 14, color: "#6b6b80" }}>Trash is empty</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
              {/* </p>
                    </button>
                  )}

                  {draftBoards.map((board) => (
                    <BoardCard key={board._id} board={board} />
                  ))}
                </div>
              </section> */}

              {/* Regular Boards Section */}
              {regularBoards.length > 0 && (
                <section>
                  <h2 style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#ffffff",
                    marginBottom: 20,
                  }}>
                    All Boards
                  </h2>
                  <div style={{
                    display: viewMode === "grid" ? "grid" : "flex",
                    gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                    flexDirection: viewMode === "list" ? "column" : undefined,
                    gap: 20,
                  }}>
                    {regularBoards.map((board) => (
                      <BoardCard key={board._id} board={board} />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <>
              {/* Search Results */}
              {filteredBoards.length > 0 ? (
                <section>
                  <h2 style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#ffffff",
                    marginBottom: 20,
                  }}>
                    Search Results
                  </h2>
                  <div style={{
                    display: viewMode === "grid" ? "grid" : "flex",
                    gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined,
                    flexDirection: viewMode === "list" ? "column" : undefined,
                    gap: 20,
                  }}>
                    {filteredBoards.map((board) => (
                      <BoardCard key={board._id} board={board} />
                    ))}
                  </div>
                </section>
              ) : (
                <div style={{
                  textAlign: "center",
                  padding: "80px 20px",
                }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 24px",
                    borderRadius: "50%",
                    background: "rgba(79, 110, 247, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Search size={40} style={{ color: "#4f6ef7" }} />
                  </div>
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 8,
                  }}>
                    No boards found
                  </h3>
                  <p style={{
                    fontSize: 14,
                    color: "#6b6b80",
                  }}>
                    Try a different search term
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
