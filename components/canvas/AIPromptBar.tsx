// ============================================================
// AIPromptBar — Floating AI input at bottom of canvas
// Users type natural language prompts → AI generates shapes/SVGs
// ============================================================

"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import {
  Sparkles,
  Send,
  Loader2,
  Wand2,
  Image,
  GitBranch,
  Palette,
  MessageSquare,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

/** Quick action buttons that appear above the prompt bar */
const QUICK_ACTIONS = [
  {
    icon: <Wand2 size={14} />,
    label: "Generate Shape",
    prompt: "Draw a ",
  },
  {
    icon: <GitBranch size={14} />,
    label: "Flowchart",
    prompt: "Make a flowchart of ",
  },
  {
    icon: <Image size={14} />,
    label: "Generate Image",
    prompt: "Generate image of ",
  },
  {
    icon: <Palette size={14} />,
    label: "Style",
    prompt: "Style the selected shapes to ",
  },
  {
    icon: <MessageSquare size={14} />,
    label: "Describe",
    prompt: "Describe what is on the canvas",
  },
];

export default function AIPromptBar() {
  const { isAILoading, setAILoading } = useCanvasStore();
  const [prompt, setPrompt] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle prompt submission.
   * Calls the Gemini backend and processes the response
   */
  const handleSubmit = async () => {
    if (!prompt.trim() || isAILoading) return;

    const { editor } = useCanvasStore.getState();
    if (!editor) {
      toast.error("Canvas not ready");
      return;
    }

    setAILoading(true);
    toast.loading("AI is thinking...", { id: "ai-prompt" });

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${BACKEND_URL}/api/ai/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      console.log("response", response)

      if (!response.ok) {
        throw new Error("Failed to process AI prompt");
      }

      const data = await response.json();

      console.log("AI Response:", data); // Debug log

      // Process the AI response based on action type
      if (data.action === "add_shapes") {
        // Add shapes to canvas
        const shapes = data.data.shapes || [];
        const viewport = editor.getViewportScreenCenter();
        
        console.log("Creating shapes:", shapes); // Debug log
        console.log("Viewport center:", viewport); // Debug log

        shapes.forEach((shape: any, index: number) => {
          // Use viewport center if coordinates are not provided or are too small (likely defaults)
          let x = shape.x;
          let y = shape.y;
          
          // If coordinates are default/small values, use viewport center
          if (x === undefined || x < 500) {
            x = viewport.x + (index * 250) - (shapes.length * 125);
          }
          if (y === undefined || y < 500) {
            y = viewport.y;
          }
          
          const w = shape.props?.w || 200;
          const h = shape.props?.h || 150;
          
          console.log("Creating shape at:", x, y, "with props:", shape.props); // Debug log

          // Get label text
          const labelText = shape.label || shape.props?.text || "";

          // Remove text from props if it exists (tldraw v2 doesn't support it)
          const cleanProps = { ...shape.props };
          delete cleanProps.text;

          try {
            // Create the geo shape
            editor.createShapes([{
              type: shape.type || "geo",
              x,
              y,
              props: {
                ...cleanProps,
                w,
                h,
              },
            }]);
            
            console.log("Shape created successfully"); // Debug log
          } catch (err) {
            console.error("Failed to create shape:", err); // Debug log
          }
        });

        toast.success(data.message || "Shapes added!", { id: "ai-prompt" });
      } else if (data.action === "add_flowchart" || data.action === "add_diagram") {
        // Add flowchart/diagram nodes
        const nodes = data.data.nodes || [];
        const edges = data.data.edges || [];
        const viewport = editor.getViewportScreenCenter();
        const nodeIds: Record<string, any> = {};

        console.log("Creating flowchart with", nodes.length, "nodes and", edges.length, "edges");

        // Create all nodes and store their IDs
        
        nodes.forEach((node: any, index: number) => {
          const cleanProps = { ...node.props };
          delete cleanProps.text; // Remove text from geo props
          
          const labelText = node.label || node.props?.text || "";
          
          const x = viewport.x + (node.x || 0) - 400;
          const y = viewport.y + (node.y || 0) - 300;
          const w = node.props?.w || 200;
          const h = node.props?.h || 100;
          
          try {
            // Create the geo shape
            const createdShapes = editor.createShapes([{
              type: node.type || "geo",
              x,
              y,
              props: {
                ...cleanProps,
                w,
                h,
              },
            }]);
            
            // Get the shape ID
            const allShapes = editor.getCurrentPageShapes();
            const lastShape = allShapes[allShapes.length - 1];
            
            if (lastShape) {
              nodeIds[node.id] = lastShape.id;
              console.log("Created node:", node.id, "with shape ID:", lastShape.id);
            }
          } catch (err) {
            console.error("Failed to create node:", node.id, err);
          }
        });

        // Create arrows between nodes after a delay
        setTimeout(() => {
          console.log("Creating arrows between", edges.length, "edges");
          console.log("Node IDs:", nodeIds);
          
          edges.forEach((edge: any) => {
            const fromShapeId = nodeIds[edge.from];
            const toShapeId = nodeIds[edge.to];
            
            console.log(`Attempting arrow: ${edge.from} (${fromShapeId}) -> ${edge.to} (${toShapeId})`);
            
            if (fromShapeId && toShapeId) {
              try {
                // Get the shapes to find their positions
                const fromShape = editor.getShape(fromShapeId);
                const toShape = editor.getShape(toShapeId);
                
                if (fromShape && toShape) {
                  // Create arrow with proper start/end coordinates
                  editor.createShapes([{
                    type: "arrow",
                    props: {
                      start: {
                        x: fromShape.x + (fromShape.props as any).w / 2,
                        y: fromShape.y + (fromShape.props as any).h,
                      },
                      end: {
                        x: toShape.x + (toShape.props as any).w / 2,
                        y: toShape.y,
                      },
                    },
                  }]);
                  console.log("Created arrow from", edge.from, "to", edge.to);
                } else {
                  console.warn("Could not find shapes for arrow");
                }
              } catch (err) {
                console.error("Failed to create arrow:", edge.from, "->", edge.to, err);
              }
            } else {
              console.warn("Missing node ID for edge:", edge.from, "->", edge.to);
            }
          });
        }, 300);

        toast.success(data.message || "Diagram created!", { id: "ai-prompt" });
      } else if (data.action === "style_update") {
        // Update styles of selected shapes
        const selectedShapes = editor.getSelectedShapes();
        if (selectedShapes.length === 0) {
          toast.info("No shapes selected to style", { id: "ai-prompt" });
        } else {
          const styles = data.data.styles || {};
          selectedShapes.forEach((shape) => {
            editor.updateShape({
              id: shape.id,
              type: shape.type,
              props: {
                ...shape.props,
                ...styles,
              },
            });
          });
          toast.success(data.message || "Styles updated!", { id: "ai-prompt" });
        }
      } else if (data.action === "describe") {
        // Show description
        toast.success(data.data.description || data.message, { id: "ai-prompt", duration: 5000 });
      } else {
        toast.info(data.message || "AI processed your request", { id: "ai-prompt" });
      }

      setPrompt("");
    } catch (error: any) {
      console.error("AI prompt error:", error);

      // Try to get error details from response
      let errorMessage = "Failed to process AI prompt";
      let errorDescription = "Please try again.";

      if (error.message) {
        errorMessage = error.message;
      }

      // Check if it's an API key issue
      if (error.message?.includes("GEMINI_API_KEY")) {
        errorDescription = "Gemini API key is not configured. Please contact the administrator.";
      }

      toast.error(errorMessage, {
        id: "ai-prompt",
        description: errorDescription,
        duration: 5000,
      });
    } finally {
      setAILoading(false);
    }
  };

  /** Handle Enter key to submit */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /** Insert a quick action prompt into the input */
  const handleQuickAction = (actionPrompt: string) => {
    setPrompt(actionPrompt);
    setShowQuickActions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="prompt-bar animate-slide-up">
      {/* Collapsed state - just show expand button */}
      {isCollapsed && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setIsCollapsed(false)}
            className="glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-default)",
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              fontSize: 12,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-accent)";
              e.currentTarget.style.color = "var(--accent-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
            aria-label="Expand AI prompt"
          >
            <Sparkles size={14} />
            Show AI Prompt
            <ChevronUp size={14} />
          </button>
        </div>
      )}

      {/* Expanded state - full prompt bar */}
      {!isCollapsed && (
        <>
          {/* Quick Actions Panel */}
          {showQuickActions && (
            <div
              className="glass animate-fade-in"
              style={{
                marginBottom: 8,
                padding: 8,
                borderRadius: "var(--radius-lg)",
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-full)",
                    color: "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-accent)";
                    e.currentTarget.style.color = "var(--accent-primary)";
                    e.currentTarget.style.background = "var(--accent-subtle)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-default)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "var(--bg-hover)";
                  }}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Main Prompt Input */}
          <div
            className={`glass ${isFocused ? "glow-accent" : ""} ${isAILoading ? "animate-pulse-glow" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: "var(--radius-xl)",
              borderColor: isFocused
                ? "var(--border-accent)"
                : "var(--border-default)",
              transition: "all var(--transition-fast)",
            }}
          >
            {/* Collapse button */}
            <button
              onClick={() => setIsCollapsed(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "transparent",
                color: "var(--text-tertiary)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                flexShrink: 0,
              }}
              aria-label="Collapse AI prompt"
            >
              <ChevronDown size={16} />
            </button>

            {/* Quick actions toggle */}
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                border: "none",
                background: showQuickActions
                  ? "var(--accent-subtle)"
                  : "transparent",
                color: showQuickActions
                  ? "var(--accent-primary)"
                  : "var(--text-tertiary)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                flexShrink: 0,
              }}
              aria-label="Quick actions"
            >
              {showQuickActions ? <X size={16} /> : <ChevronUp size={16} />}
            </button>

            {/* AI Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "var(--radius-md)",
                background:
                  "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                flexShrink: 0,
              }}
            >
              {isAILoading ? (
                <Loader2 size={16} color="white" className="animate-spin" />
              ) : (
                <Sparkles size={16} color="white" />
              )}
            </div>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask AI: 'draw a flowchart', 'generate a sunset image', 'style shapes dark'..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isAILoading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
              }}
            />

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isAILoading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                border: "none",
                background:
                  prompt.trim() && !isAILoading
                    ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
                    : "var(--bg-hover)",
                color:
                  prompt.trim() && !isAILoading
                    ? "white"
                    : "var(--text-disabled)",
                cursor:
                  prompt.trim() && !isAILoading ? "pointer" : "not-allowed",
                transition: "all var(--transition-fast)",
                flexShrink: 0,
              }}
              aria-label="Send prompt"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Keyboard hint */}
          <div
            style={{
              textAlign: "center",
              marginTop: 6,
              fontSize: 11,
              color: "var(--text-tertiary)",
              fontWeight: 400,
            }}
          >
            Press <strong>Enter</strong> to send • <strong>↑</strong> for quick
            actions
          </div>
        </>
      )}
    </div>
  );
}
