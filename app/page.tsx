// ============================================================
// Home Page — Landing / redirect to board
// For Phase 1 we go straight to the canvas board
// In Phase 3+ this will redirect to /dashboard
// ============================================================

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnterCanvas = () => {
    setIsLoading(true);
    // For Phase 1: navigate to a local board
    // In Phase 2+: redirect to /dashboard or /board/:id
    router.push("/board/local");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(124, 92, 252, 0.12) 0%, transparent 60%), var(--bg-primary)",
        overflow: "auto",
        padding: 24,
      }}
    >
      {/* Hero */}
      <div
        className="animate-fade-in"
        style={{
          textAlign: "center",
          maxWidth: 640,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "var(--radius-xl)",
            background:
              "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            boxShadow:
              "0 0 60px rgba(124, 92, 252, 0.3), var(--shadow-lg)",
          }}
        >
          <Sparkles size={40} color="white" />
        </div>

        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 16,
            background:
              "linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 50%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Canvas Board
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: 40,
            maxWidth: 480,
            margin: "0 auto 40px",
          }}
        >
          Create stunning diagrams, flowcharts, and illustrations with
          AI-powered tools. Just describe what you want and watch it appear.
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {[
            "🎨 Freehand Drawing",
            "🤖 AI Shape Generation",
            "📊 Smart Flowcharts",
            "🖼️ AI Image Generation",
            "👥 Real-time Collaboration",
            "📤 Multi-format Export",
          ].map((feature) => (
            <span
              key={feature}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnterCanvas}
          disabled={isLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 36px",
            borderRadius: "var(--radius-lg)",
            border: "none",
            background:
              "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            cursor: isLoading ? "wait" : "pointer",
            boxShadow:
              "0 0 30px rgba(124, 92, 252, 0.3), var(--shadow-md)",
            transition: "all var(--transition-base)",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 0 50px rgba(124, 92, 252, 0.4), var(--shadow-lg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(124, 92, 252, 0.3), var(--shadow-md)";
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Loading Canvas...
            </>
          ) : (
            <>
              Start Creating
              <ArrowRight size={20} />
            </>
          )}
        </button>

        {/* Keyboard shortcut hint */}
        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
          Press <strong>V</strong> for select, <strong>D</strong> for draw,{" "}
          <strong>R</strong> for rectangle, <strong>T</strong> for text
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          fontSize: 12,
          color: "var(--text-tertiary)",
        }}
      >
        Built with Next.js, tldraw & AI • Phase 1
      </div>
    </div>
  );
}
