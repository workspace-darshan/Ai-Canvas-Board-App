// ============================================================
// Board Page — Main canvas view at /board/[id]
// Assembles all canvas components into the full drawing UI
// ============================================================

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCanvasStore } from "@/store/canvasStore";
import { Loader2, Sparkles } from "lucide-react";
import LiveblocksProvider from "@/components/canvas/LiveblocksProvider";

// Dynamic imports to prevent SSR issues with tldraw (it uses browser APIs)
const CollaborativeCanvas = dynamic(
  () => import("@/components/canvas/CollaborativeCanvas"),
  { ssr: false }
);
const TopBar = dynamic(
  () => import("@/components/canvas/TopBarWithLiveblocks"),
  { ssr: false }
);
const Toolbar = dynamic(
  () => import("@/components/canvas/Toolbar"),
  { ssr: false }
);
const AIPromptBar = dynamic(
  () => import("@/components/canvas/AIPromptBar"),
  { ssr: false }
);
const PropertiesPanel = dynamic(
  () => import("@/components/canvas/PropertiesPanel"),
  { ssr: false }
);

const ZoomIndicator = dynamic(
  () => import("@/components/canvas/ZoomIndicator"),
  { ssr: false }
);
const KeyboardShortcuts = dynamic(
  () => import("@/components/canvas/KeyboardShortcuts"),
  { ssr: false }
);

export default function BoardPage() {
  const [isReady, setIsReady] = useState(false);
  const params = useParams();
  const { setBoardId } = useCanvasStore();

  // Set board ID from URL params
  useEffect(() => {
    if (params.id) {
      setBoardId(params.id as string);
    }
  }, [params.id, setBoardId]);

  // Small delay to allow dynamic imports to load gracefully
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          gap: 20,
        }}
      >
        {/* Loading animation */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-xl)",
            background:
              "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 60px rgba(124, 92, 252, 0.3)",
          }}
          className="animate-pulse-glow"
        >
          <Sparkles size={32} color="white" />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--text-secondary)",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Loader2 size={18} className="animate-spin" />
          Loading canvas...
        </div>
      </div>
    );
  }

  return (
    <LiveblocksProvider boardId={params.id as string}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "var(--bg-primary)",
          position: "relative",
        }}
      >
        {/* The tldraw canvas fills the entire viewport */}
        <CollaborativeCanvas />

        {/* UI overlays on top of the canvas */}
        <TopBar />
        <Toolbar />
        <PropertiesPanel />
        <ZoomIndicator />
        <AIPromptBar />

        {/* Invisible keyboard shortcut handler */}
        <KeyboardShortcuts />
      </div>
    </LiveblocksProvider>
  );
}
