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
   * In Phase 4 this will call the Groq backend;
   * for now we show a toast preview.
   */
  const handleSubmit = async () => {
    if (!prompt.trim() || isAILoading) return;

    setAILoading(true);
    toast.loading("AI is thinking...", { id: "ai-prompt" });

    try {
      // Phase 4: Replace with actual API call to backend
      // const response = await fetch(`${BACKEND_URL}/api/ai/prompt`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt: prompt.trim() }),
      // });
      // const data = await response.json();

      // Simulate AI response for Phase 1
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("AI feature will be connected in Phase 4!", {
        id: "ai-prompt",
        description: `Your prompt: "${prompt.trim()}"`,
      });

      setPrompt("");
    } catch (error) {
      toast.error("Failed to process AI prompt", {
        id: "ai-prompt",
        description: "Please try again.",
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
