// ============================================================
// Shared Board View Page — View-only access via share link
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CanvasBoard from "@/components/canvas/CanvasBoard";
import TopBar from "@/components/canvas/TopBar";
import Toolbar from "@/components/canvas/Toolbar";
import { useCanvasStore } from "@/store/canvasStore";
import { Eye } from "lucide-react";
import { getApiUrl } from "@/lib/config";

export default function SharedBoardViewPage() {
  const params = useParams();
  const token = params.token as string;
  const { setBoardTitle, editor } = useCanvasStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSharedBoard();
  }, [token]);

  useEffect(() => {
    if (editor) {
      // Set editor to readonly mode
      editor.updateInstanceState({ isReadonly: true });
    }
  }, [editor]);

  const loadSharedBoard = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/boards/shared/${token}`));
      
      if (!response.ok) {
        throw new Error("Access denied or board not found");
      }

      const data = await response.json();
      
      if (data.sharePermission === "none") {
        throw new Error("This board is not shared");
      }

      setBoardTitle(data.title);
      
      // Load board content if available
      if (data.content && editor) {
        try {
          const snapshot = JSON.parse(data.content);
          editor.store.put(Object.values(snapshot.store));
        } catch (e) {
          console.error("Failed to load board content:", e);
        }
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error("Failed to load shared board:", error);
      setError(error.message || "Failed to load board");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--border-default)",
              borderTopColor: "var(--accent-primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Loading board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400 }}>
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
            <Eye size={32} style={{ color: "var(--text-tertiary)" }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
            Access Denied
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-primary)" }}>
      {/* Readonly Banner */}
      <div
        style={{
          position: "fixed",
          top: 56,
          left: 0,
          right: 0,
          zIndex: 49,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Eye size={16} color="white" />
        <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
          You are viewing this board in read-only mode
        </span>
      </div>

      <TopBar />
      <Toolbar />
      <CanvasBoard />
    </div>
  );
}
