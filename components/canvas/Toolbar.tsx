// ============================================================
// Toolbar — Left sidebar with drawing tools
// Glass-morphism dark panel with tool icons
// ============================================================

"use client";

import { useState, useRef, useEffect } from "react";
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
  Quote,
  Image,
  Triangle,
  Hexagon,
  Star,
  Cloud,
  Heart,
  X,
  Check,
  ArrowUp,
  MoreHorizontal,
} from "lucide-react";
import IconPicker from "./IconPicker";

/** Main toolbar tools - shown directly */
const MAIN_TOOLS: {
  id: Tool;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  tldrawTool: string;
  geoType?: string;
}[] = [
  {
    id: "select",
    icon: <MousePointer2 size={16} />,
    label: "Select",
    shortcut: "V",
    tldrawTool: "select",
  },
  {
    id: "hand",
    icon: <Hand size={16} />,
    label: "Hand",
    shortcut: "H",
    tldrawTool: "hand",
  },
  {
    id: "draw",
    icon: <Pencil size={16} />,
    label: "Draw",
    shortcut: "D",
    tldrawTool: "draw",
  },
  {
    id: "eraser",
    icon: <Eraser size={16} />,
    label: "Eraser",
    shortcut: "E",
    tldrawTool: "eraser",
  },
  {
    id: "rectangle",
    icon: <Square size={16} />,
    label: "Rectangle",
    shortcut: "R",
    tldrawTool: "geo",
    geoType: "rectangle",
  },
  {
    id: "ellipse",
    icon: <Circle size={16} />,
    label: "Ellipse",
    shortcut: "O",
    tldrawTool: "geo",
    geoType: "ellipse",
  },
  {
    id: "triangle",
    icon: <Triangle size={16} />,
    label: "Triangle",
    shortcut: "Shift+T",
    tldrawTool: "geo",
    geoType: "triangle",
  },
  {
    id: "star",
    icon: <Star size={16} />,
    label: "Star",
    shortcut: "Shift+S",
    tldrawTool: "geo",
    geoType: "star",
  },
  {
    id: "arrow",
    icon: <MoveRight size={16} />,
    label: "Arrow",
    shortcut: "A",
    tldrawTool: "arrow",
  },
  {
    id: "text",
    icon: <Type size={16} />,
    label: "Text",
    shortcut: "T",
    tldrawTool: "text",
  },
  {
    id: "note",
    icon: <StickyNote size={16} />,
    label: "Sticky Note",
    shortcut: "N",
    tldrawTool: "note",
  },
  {
    id: "frame",
    icon: <Frame size={16} />,
    label: "Frame",
    shortcut: "F",
    tldrawTool: "frame",
  },
  {
    id: "icon",
    icon: <Smile size={16} />,
    label: "Icons",
    shortcut: "I",
    tldrawTool: "select",
  },
];

/** Extra tools - shown in "More" menu */
const EXTRA_TOOLS: {
  id: Tool;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  tldrawTool: string;
  geoType?: string;
}[] = [
  {
    id: "diamond",
    icon: <Diamond size={16} />,
    label: "Diamond",
    shortcut: "G",
    tldrawTool: "geo",
    geoType: "diamond",
  },
  {
    id: "hexagon",
    icon: <Hexagon size={16} />,
    label: "Hexagon",
    shortcut: "Shift+H",
    tldrawTool: "geo",
    geoType: "hexagon",
  },
  {
    id: "cloud",
    icon: <Cloud size={16} />,
    label: "Cloud",
    shortcut: "Shift+C",
    tldrawTool: "geo",
    geoType: "cloud",
  },
  {
    id: "heart",
    icon: <Heart size={16} />,
    label: "Heart",
    shortcut: "Shift+L",
    tldrawTool: "geo",
    geoType: "heart",
  },
  {
    id: "x-box",
    icon: <X size={16} />,
    label: "X Mark",
    shortcut: "Shift+X",
    tldrawTool: "geo",
    geoType: "x-box",
  },
  {
    id: "check-box",
    icon: <Check size={16} />,
    label: "Check Mark",
    shortcut: "Shift+K",
    tldrawTool: "geo",
    geoType: "check-box",
  },
  {
    id: "arrow-up",
    icon: <ArrowUp size={16} />,
    label: "Arrow Shape",
    shortcut: "Alt+Up",
    tldrawTool: "geo",
    geoType: "arrow-up",
  },
  {
    id: "quote",
    icon: <Quote size={16} />,
    label: "Quote",
    shortcut: "Q",
    tldrawTool: "text",
  },
  {
    id: "image",
    icon: <Image size={16} />,
    label: "Image",
    shortcut: "Shift+I",
    tldrawTool: "asset",
  },
];

export default function Toolbar() {
  const { activeTool, setActiveTool, editor, isLeftSidebarOpen, toggleLeftSidebar, setCurrentGeoType } =
    useCanvasStore();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Check if editor is ready
  useEffect(() => {
    if (editor) {
      setIsEditorReady(true);
      console.log("Editor is ready in Toolbar");
    } else {
      setIsEditorReady(false);
    }
  }, [editor]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMoreMenuOpen]);

  /**
   * Handle tool selection — updates both our Zustand store
   * and the actual tldraw editor tool.
   */
  const handleToolSelect = (tool: (typeof MAIN_TOOLS)[number] | (typeof EXTRA_TOOLS)[number]) => {
    console.log("Tool selected:", tool.id, "Editor available:", !!editor, "Editor ready:", isEditorReady);
    
    // Special case: icon tool opens picker instead of changing tool
    if (tool.id === "icon") {
      setIsIconPickerOpen(true);
      return;
    }

    // Special case: image tool
    if (tool.id === "image") {
      setActiveTool("select");
      if (editor) {
        // Trigger file input for image upload
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file && editor) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              if (dataUrl) {
                // Create image shape at center of viewport
                const { x, y } = editor.getViewportScreenCenter();
                editor.createShape({
                  type: "image",
                  x: x - 100,
                  y: y - 100,
                  props: {
                    w: 200,
                    h: 200,
                    assetId: null as any,
                    url: dataUrl,
                  },
                });
              }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      }
      return;
    }

    // Special case: quote tool creates a text shape
    if (tool.id === "quote") {
      setActiveTool("text");
      if (editor) {
        editor.setCurrentTool("text");
      }
      return;
    }

    setActiveTool(tool.id);

    if (!editor) {
      console.error("Editor not available! Waiting for editor to be ready...");
      // Retry after a short delay
      setTimeout(() => {
        const currentEditor = useCanvasStore.getState().editor;
        if (currentEditor) {
          console.log("Editor now available, retrying tool selection");
          if (tool.tldrawTool === "geo" && tool.geoType) {
            setCurrentGeoType(tool.geoType);
            currentEditor.setStyleForNextShapes(GeoShapeGeoStyle, tool.geoType as never);
            currentEditor.setCurrentTool("geo");
          } else {
            currentEditor.setCurrentTool(tool.tldrawTool);
          }
        }
      }, 500);
      return;
    }

    // For geo shapes, set the geo style FIRST, then switch tool
    if (tool.tldrawTool === "geo" && tool.geoType) {
      console.log("Setting geo type:", tool.geoType);
      setCurrentGeoType(tool.geoType);
      editor.setStyleForNextShapes(GeoShapeGeoStyle, tool.geoType as never);
      editor.setCurrentTool("geo");
      console.log("Current tool after setting:", editor.getCurrentToolId());
    } else {
      console.log("Setting tool:", tool.tldrawTool);
      editor.setCurrentTool(tool.tldrawTool);
      console.log("Current tool after setting:", editor.getCurrentToolId());
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
          left: isLeftSidebarOpen ? 74 : 12,
          zIndex: 51,
          width: 20,
          height: 20,
          borderRadius: "var(--radius-full)",
          transition: "left var(--transition-base)",
        }}
        aria-label={isLeftSidebarOpen ? "Collapse toolbar" : "Expand toolbar"}
      >
        {isLeftSidebarOpen ? (
          <ChevronLeft size={10} />
        ) : (
          <ChevronRight size={10} />
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
          padding: 8,
          borderRadius: "var(--radius-xl)",
          transform: isLeftSidebarOpen
            ? "translateX(0)"
            : "translateX(-120%)",
          transition: "transform var(--transition-base)",
          width: 64,
        }}
      >
        {/* Main tools */}
        {MAIN_TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`tool-button ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => handleToolSelect(tool)}
            aria-label={tool.label}
            style={{
              width: "48px",
              height: "40px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-md)",
            }}
          >
            {tool.icon}
            <span 
              className="tooltip"
              style={{
                position: "absolute",
                left: "calc(100% + 8px)",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "4px 8px",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                fontSize: "11px",
                fontWeight: 500,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-default)",
                whiteSpace: "nowrap",
                opacity: 0,
                pointerEvents: "none",
                transition: "opacity var(--transition-fast)",
                zIndex: 1000,
                boxShadow: "var(--shadow-md)",
              }}
            >
              {tool.label}
              <span
                style={{
                  marginLeft: 6,
                  opacity: 0.5,
                  fontSize: 10,
                }}
              >
                {tool.shortcut}
              </span>
            </span>
          </button>
        ))}

        {/* More menu button */}
        <div style={{ position: "relative" }} ref={moreMenuRef}>
          <button
            className="tool-button"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            aria-label="More tools"
            style={{
              width: "48px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-md)",
              marginTop: 4,
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {/* More menu dropdown */}
          {isMoreMenuOpen && (
            <div
              className="glass"
              style={{
                position: "absolute",
                left: "calc(100% + 8px)",
                bottom: 0,
                zIndex: 100,
                display: "grid",
                gridTemplateColumns: "repeat(2, 40px)",
                gap: 4,
                padding: 8,
                borderRadius: "var(--radius-lg)",
                maxHeight: "400px",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {EXTRA_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  className={`tool-button ${activeTool === tool.id ? "active" : ""}`}
                  onClick={() => {
                    handleToolSelect(tool);
                    setIsMoreMenuOpen(false);
                  }}
                  aria-label={tool.label}
                  style={{
                    width: "40px",
                    height: "36px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {tool.icon}
                  <span 
                    className="tooltip"
                    style={{
                      position: "absolute",
                      left: "calc(100% + 8px)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "4px 8px",
                      background: "var(--bg-elevated)",
                      color: "var(--text-primary)",
                      fontSize: "11px",
                      fontWeight: 500,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-default)",
                      whiteSpace: "nowrap",
                      opacity: 0,
                      pointerEvents: "none",
                      transition: "opacity var(--transition-fast)",
                      zIndex: 1000,
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    {tool.label}
                    <span
                      style={{
                        marginLeft: 6,
                        opacity: 0.5,
                        fontSize: 10,
                      }}
                    >
                      {tool.shortcut}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Icon Picker Modal */}
      <IconPicker
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
      />
    </>
  );
}
