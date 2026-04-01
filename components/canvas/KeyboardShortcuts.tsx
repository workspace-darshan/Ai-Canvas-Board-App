// ============================================================
// KeyboardShortcuts — Global keyboard event handler
// Maps keyboard shortcuts to tool selection and actions
// ============================================================

"use client";

import { useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { GeoShapeGeoStyle } from "@tldraw/tlschema";
import type { Tool } from "@/types";

/** Map our tool IDs to tldraw geo sub-types */
const GEO_TYPE_MAP: Record<string, string> = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  diamond: "diamond",
};

/** Keyboard shortcut map: key → tool */
const SHORTCUT_MAP: Record<string, Tool> = {
  v: "select",
  h: "hand",
  d: "draw",
  e: "eraser",
  a: "arrow",
  r: "rectangle",
  o: "ellipse",
  g: "diamond",
  t: "text",
  n: "note",
  f: "frame",
};

export default function KeyboardShortcuts() {
  const { editor, setActiveTool } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture shortcuts when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Check if user is editing text in tldraw
      if (editor) {
        const currentTool = editor.getCurrentToolId();
        const editingShapeId = editor.getEditingShapeId();
        
        // If text tool is active OR a shape is being edited (text editing mode)
        // disable all tool shortcuts so user can type freely
        if (currentTool === "text" || editingShapeId) {
          // Only allow Escape to exit text editing
          if (e.key === "Escape") {
            editor.setCurrentTool("select");
            setActiveTool("select");
          }
          return;
        }
      }

      const key = e.key.toLowerCase();

      // Tool shortcuts
      if (SHORTCUT_MAP[key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const tool = SHORTCUT_MAP[key];
        setActiveTool(tool);

        if (editor) {
          // Map our tool to tldraw tool
          const tldrawToolMap: Record<string, string> = {
            select: "select",
            hand: "hand",
            draw: "draw",
            eraser: "eraser",
            arrow: "arrow",
            rectangle: "geo",
            ellipse: "geo",
            diamond: "geo",
            text: "text",
            note: "note",
            frame: "frame",
          };
          const tldrawTool = tldrawToolMap[tool];
          if (tldrawTool) {
            // For geo shapes, set the geo style FIRST so tldraw
            // knows to draw ellipse/diamond instead of rectangle
            if (tldrawTool === "geo" && GEO_TYPE_MAP[tool]) {
              editor.setStyleForNextShapes(GeoShapeGeoStyle, GEO_TYPE_MAP[tool] as never);
            }
            editor.setCurrentTool(tldrawTool);
          }
        }
      }

      // Undo: Ctrl+Z
      if (key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        // Let tldraw handle this natively
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        (key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (key === "y" && (e.ctrlKey || e.metaKey))
      ) {
        // Let tldraw handle this natively
      }

      // Delete
      if (key === "delete" || key === "backspace") {
        // Let tldraw handle this natively
      }

      // Zoom to fit: Shift+1
      if (key === "1" && e.shiftKey && editor) {
        e.preventDefault();
        editor.zoomToFit();
      }

      // Reset zoom: Ctrl+0
      if (key === "0" && (e.ctrlKey || e.metaKey) && editor) {
        e.preventDefault();
        editor.resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, setActiveTool]);

  // This component renders nothing — it's purely a side-effect hook
  return null;
}
