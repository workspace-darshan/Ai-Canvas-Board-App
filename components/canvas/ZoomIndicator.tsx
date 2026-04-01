// ============================================================
// ZoomIndicator — Bottom-right zoom info + mini map toggle
// ============================================================

"use client";

import { useCanvasStore } from "@/store/canvasStore";
import { Minus, Plus, Scan } from "lucide-react";

export default function ZoomIndicator() {
  const { editor, zoomLevel } = useCanvasStore();

  const handleZoomIn = () => editor?.zoomIn();
  const handleZoomOut = () => editor?.zoomOut();
  const handleZoomToFit = () => editor?.zoomToFit();

  return (
    <div
      className="glass"
      style={{
        position: "fixed",
        bottom: 80,
        right: 12,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 4,
        borderRadius: "var(--radius-md)",
      }}
    >
      <button
        className="tool-button"
        onClick={handleZoomOut}
        style={{ width: 30, height: 30 }}
        aria-label="Zoom out"
      >
        <Minus size={14} />
      </button>

      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--text-secondary)",
          minWidth: 44,
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {Math.round(zoomLevel * 100)}%
      </span>

      <button
        className="tool-button"
        onClick={handleZoomIn}
        style={{ width: 30, height: 30 }}
        aria-label="Zoom in"
      >
        <Plus size={14} />
      </button>

      <div className="divider" style={{ height: 18 }} />

      <button
        className="tool-button"
        onClick={handleZoomToFit}
        style={{ width: 30, height: 30 }}
        aria-label="Zoom to fit"
      >
        <Scan size={14} />
      </button>
    </div>
  );
}
