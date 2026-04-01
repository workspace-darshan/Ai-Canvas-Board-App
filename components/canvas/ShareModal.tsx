// ============================================================
// ShareModal — Share board with permissions and collaborators
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { X, Copy, Check, UserPlus, Loader2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import { getApiUrl, getShareLink } from "@/lib/config";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

type SharePermission = "view" | "edit" | "none";
type CollaboratorRole = "owner" | "editor" | "viewer";

interface Collaborator {
  _id: string;
  email: string;
  role: CollaboratorRole;
  addedAt: string;
}

export default function ShareModal({ isOpen, onClose, boardId }: ShareModalProps) {
  const { boardTitle } = useCanvasStore();
  const [shareToken, setShareToken] = useState("");
  const [sharePermission, setSharePermission] = useState<SharePermission>("none");
  const [isPublic, setIsPublic] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);

  // Check if this is a local board (not saved to database)
  const isLocalBoard = !boardId || boardId === "local";

  // Load board share settings
  useEffect(() => {
    if (isOpen && boardId && !isLocalBoard) {
      loadShareSettings();
    }
  }, [isOpen, boardId, isLocalBoard]);

  const loadShareSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/boards/${boardId}`));
      const data = await response.json();

      setShareToken(data.shareToken || "");
      setSharePermission(data.sharePermission || "none");
      setIsPublic(data.isPublic || false);
      setCollaborators(data.collaborators || []);
    } catch (error) {
      console.error("Failed to load share settings:", error);
      toast.error("Failed to load share settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSharePermission = async (permission: SharePermission) => {
    try {
      const response = await fetch(getApiUrl(`/api/boards/${boardId}/share`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission, isPublic }),
      });

      const data = await response.json();
      setSharePermission(permission);
      setShareToken(data.shareToken);

      toast.success("Share settings updated");
    } catch (error) {
      console.error("Failed to update share settings:", error);
      toast.error("Failed to update share settings");
    }
  };

  const togglePublic = async () => {
    const newPublicState = !isPublic;
    try {
      await fetch(getApiUrl(`/api/boards/${boardId}/share`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: sharePermission, isPublic: newPublicState }),
      });

      setIsPublic(newPublicState);
      toast.success(newPublicState ? "Board is now public" : "Board is now private");
    } catch (error) {
      console.error("Failed to toggle public:", error);
      toast.error("Failed to update public setting");
    }
  };

  const copyShareLink = () => {
    const shareUrl = getShareLink(sharePermission as "view" | "edit", shareToken);

    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");

    setTimeout(() => setIsCopied(false), 2000);
  };

  const addCollaborator = async () => {
    if (!newEmail.trim()) {
      toast.error("Please enter an email");
      return;
    }

    setIsAddingCollaborator(true);
    try {
      const response = await fetch(getApiUrl(`/api/boards/${boardId}/invite`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: "viewer" }),
      });

      const data = await response.json();

      if (response.ok) {
        setCollaborators([...collaborators, data.collaborator]);
        setNewEmail("");
        toast.success(`Invited ${newEmail}`);
      } else {
        toast.error(data.error || "Failed to invite collaborator");
      }
    } catch (error) {
      console.error("Failed to add collaborator:", error);
      toast.error("Failed to invite collaborator");
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  const updateCollaboratorRole = async (collaboratorId: string, newRole: CollaboratorRole) => {
    try {
      await fetch(getApiUrl(`/api/boards/${boardId}/collaborators/${collaboratorId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      setCollaborators(
        collaborators.map((c) => (c._id === collaboratorId ? { ...c, role: newRole } : c))
      );

      toast.success("Role updated");
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      await fetch(getApiUrl(`/api/boards/${boardId}/collaborators/${collaboratorId}`), {
        method: "DELETE",
      });

      setCollaborators(collaborators.filter((c) => c._id !== collaboratorId));
      toast.success("Collaborator removed");
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
      toast.error("Failed to remove collaborator");
    }
  };

  if (!isOpen) return null;

  const shareUrl = shareToken ? getShareLink(sharePermission as "view" | "edit", shareToken) : "";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 100,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        className="glass animate-fade-in"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
          zIndex: 101,
          borderRadius: "var(--radius-lg)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Share "{boardTitle}"
          </h3>
          <button className="tool-button" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--text-tertiary)" }} />
          </div>
        ) : isLocalBoard ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--bg-hover)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Globe size={32} style={{ color: "var(--text-tertiary)" }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              Save Board First
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
              This is a local board. Save it to the database first to enable sharing features.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: "10px 24px",
                background: "var(--accent-primary)",
                border: "1px solid var(--border-accent)",
                borderRadius: "var(--radius-md)",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            {/* Share Link */}
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                Share Link
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={shareUrl || "Enable sharing to generate link"}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)",
                    fontSize: 12,
                    fontFamily: "monospace",
                  }}
                />
                <button
                  onClick={copyShareLink}
                  disabled={!shareToken || sharePermission === "none"}
                  style={{
                    padding: "10px 16px",
                    background: isCopied ? "var(--accent-subtle)" : "var(--bg-hover)",
                    border: "1px solid",
                    borderColor: isCopied ? "var(--border-accent)" : "var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    color: isCopied ? "var(--accent-primary)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: shareToken && sharePermission !== "none" ? "pointer" : "not-allowed",
                    opacity: shareToken && sharePermission !== "none" ? 1 : 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  {isCopied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Link Permission */}
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                Link Permission
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(
                  [
                    { value: "view", label: "View only", desc: "Can see, not edit" },
                    { value: "edit", label: "Can edit", desc: "Full access" },
                    { value: "none", label: "No access", desc: "Link disabled" },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: sharePermission === option.value ? "var(--accent-subtle)" : "var(--bg-hover)",
                      border: "1px solid",
                      borderColor: sharePermission === option.value ? "var(--border-accent)" : "var(--border-default)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <input
                      type="radio"
                      name="permission"
                      value={option.value}
                      checked={sharePermission === option.value}
                      onChange={() => updateSharePermission(option.value)}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "var(--border-default)" }} />

            {/* Invite by Email */}
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                Invite by Email
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCollaborator()}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                  }}
                />
                <button
                  onClick={addCollaborator}
                  disabled={isAddingCollaborator}
                  style={{
                    padding: "10px 16px",
                    background: "var(--accent-primary)",
                    border: "1px solid var(--border-accent)",
                    borderRadius: "var(--radius-md)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: isAddingCollaborator ? "not-allowed" : "pointer",
                    opacity: isAddingCollaborator ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {isAddingCollaborator ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                </button>
              </div>
            </div>

            {/* Collaborators List */}
            {collaborators.length > 0 && (
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                  People with access
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {collaborators.map((collab) => (
                    <div
                      key={collab._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        background: "var(--bg-hover)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--accent-subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--accent-primary)",
                        }}
                      >
                        {collab.email[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{collab.email}</div>
                      </div>
                      {collab.role === "owner" ? (
                        <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600 }}>Owner</span>
                      ) : (
                        <select
                          value={collab.role}
                          onChange={(e) => updateCollaboratorRole(collab._id, e.target.value as CollaboratorRole)}
                          style={{
                            padding: "4px 8px",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-default)",
                            borderRadius: "var(--radius-sm)",
                            color: "var(--text-primary)",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ height: 1, background: "var(--border-default)" }} />

            {/* Public Board Toggle */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: isPublic ? "var(--accent-subtle)" : "var(--bg-elevated)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isPublic ? "var(--accent-primary)" : "var(--text-tertiary)",
                }}
              >
                {isPublic ? <Globe size={18} /> : <Lock size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Public Board</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                  Anyone with link can {sharePermission === "edit" ? "edit" : "view"}
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={togglePublic}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
            </label>

            {/* Done Button */}
            <button
              onClick={onClose}
              style={{
                padding: "12px 16px",
                background: "var(--accent-primary)",
                border: "1px solid var(--border-accent)",
                borderRadius: "var(--radius-md)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              Done
            </button>
          </>
        )}
      </div>
    </>
  );
}
