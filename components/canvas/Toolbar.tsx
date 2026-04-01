// ============================================================
// Toolbar — Left sidebar with drawing tools
// Glass-morphism dark panel with tool icons
// ============================================================

"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { GeoShapeGeoStyle } from "@tldraw/tlschema";
import type { Tool } from "@/types";
import {
  MousePointer2,
  Pencil,
  Eraser,
  MoveRight,
  Square,
  Circle,
  Diamond,
  Type,
  StickyNote,
  Frame,
  Hand,
  ChevronLeft,
  ChevronRight,
  Smile,
} from "lucide-react";
import IconPicker from "./IconPicker";

/** Tool definitions with icon, label, keyboard shortcut, and tldraw tool id */
const TOOLS: {
  id: Tool;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  tldrawTool: string;
  /** For geo tool: which geo sub-type to set */
  geoType?: string;
}[] = [
  {
    id: "select",
    icon: <MousePointer2 size={18} />,
    label: "Select",
    shortcut: "V",
    tldrawTool: "select",
  },
  {
    id: "hand",
    icon: <Hand size={18} />,
    label: "Hand",
    shortcut: "H",
    tldrawTool: "hand",
  },
  {
    id: "draw",
    icon: <Pencil size={18} />,
    label: "Draw",
    shortcut: "D",
    tldrawTool: "draw",
  },
  {
    id: "eraser",
    icon: <Eraser size={18} />,
    label: "Eraser",
    shortcut: "E",
    tldrawTool: "eraser",
  },
  {
    id: "arrow",
    icon: <MoveRight size={18} />,
    label: "Arrow",
    shortcut: "A",
    tldrawTool: "arrow",
  },
  {
    id: "rectangle",
    icon: <Square size={18} />,
    label: "Rectangle",
    shortcut: "R",
    tldrawTool: "geo",
    geoType: "rectangle",
  },
  {
    id: "ellipse",
    icon: <Circle size={18} />,
    label: "Ellipse",
    shortcut: "O",
    tldrawTool: "geo",
    geoType: "ellipse",
  },
  {
    id: "diamond",
    icon: <Diamond size={18} />,
    label: "Diamond",
    shortcut: "G",
    tldrawTool: "geo",
    geoType: "diamond",
  },
  {
    id: "text",
    icon: <Type size={18} />,
    label: "Text",
    shortcut: "T",
    tldrawTool: "text",
  },
  {
    id: "note",
    icon: <StickyNote size={18} />,
    label: "Sticky Note",
    shortcut: "N",
    tldrawTool: "note",
  },
  {
    id: "frame",
    icon: <Frame size={18} />,
    label: "Frame",
    shortcut: "F",
    tldrawTool: "frame",
  },
  {
    id: "icon",
    icon: <Smile size={18} />,
    label: "Icons",
    shortcut: "I",
    tldrawTool: "select", // Opens icon picker instead
  },
];

export default function Toolbar() {
  const { activeTool, setActiveTool, editor, isLeftSidebarOpen, toggleLeftSidebar, setCurrentGeoType } =
    useCanvasStore();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  /**
   * Handle tool selection — updates both our Zustand store
   * and the actual tldraw editor tool.
   *
   * For geo shapes (rectangle, ellipse, diamond):
   * tldraw v4 uses `GeoShapeGeoStyle` to determine which geo sub-type
   * to draw. We must call `setStyleForNextShapes(GeoShapeGeoStyle, ...)` 
   * BEFORE switching to the geo tool.
   */
  const handleToolSelect = (tool: (typeof TOOLS)[number]) => {
    // Special case: icon tool opens picker instead of changing tool
    if (tool.id === "icon") {
      setIsIconPickerOpen(true);
      return;
    }

    setActiveTool(tool.id);

    if (!editor) return;

    // For geo shapes, set the geo style FIRST, then switch tool
    if (tool.tldrawTool === "geo" && tool.geoType) {
      setCurrentGeoType(tool.geoType);
      editor.setStyleForNextShapes(GeoShapeGeoStyle, tool.geoType as never);
      editor.setCurrentTool("geo");
    } else {
      editor.setCurrentTool(tool.tldrawTool);
    }
  };

  return (
    <>
      {/* Collapse/expand toggle */}
      <button
        className="tool-button glass"
        onClick={toggleLeftSidebar}
        style={{
          position: "fixed",
          top: 68,
          left: isLeftSidebarOpen ? 62 : 12,
          zIndex: 51,
          width: 28,
          height: 28,
          borderRadius: "var(--radius-full)",
          transition: "left var(--transition-base)",
        }}
        aria-label={isLeftSidebarOpen ? "Collapse toolbar" : "Expand toolbar"}
      >
        {isLeftSidebarOpen ? (
          <ChevronLeft size={14} />
        ) : (
          <ChevronRight size={14} />
        )}
      </button>

      {/* Toolbar panel */}
      <div
        className="glass animate-fade-in"
        style={{
          position: "fixed",
          top: 64,
          left: 12,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: 6,
          borderRadius: "var(--radius-lg)",
          transform: isLeftSidebarOpen
            ? "translateX(0)"
            : "translateX(-120%)",
          transition: "transform var(--transition-base)",
        }}
      >
        {TOOLS.map((tool, index) => (
          <div key={tool.id}>
            {/* Visual separator between tool groups */}
            {(index === 2 || index === 4 || index === 8) && (
              <div
                style={{
                  height: 1,
                  background: "var(--border-default)",
                  margin: "4px 6px",
                }}
              />
            )}

            <button
              className={`tool-button ${activeTool === tool.id ? "active" : ""}`}
              onClick={() => handleToolSelect(tool)}
              aria-label={tool.label}
            >
              {tool.icon}
              <span className="tooltip">
                {tool.label}
                <span
                  style={{
                    marginLeft: 8,
                    opacity: 0.5,
                    fontSize: 11,
                  }}
                >
                  {tool.shortcut}
                </span>
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Icon Picker Modal */}
      <IconPicker
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
      />
    </>
  );
}
