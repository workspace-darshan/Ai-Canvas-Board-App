// ============================================================
// Before/After Comparison — Conversion booster
// ============================================================

"use client";

import { X, Check } from "lucide-react";

export default function BeforeAfter() {
  return (
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 32,
    }}>
      {/* Without AI Canvas */}
      <div style={{
        padding: 32,
        borderRadius: 16,
        background: "#13131c",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 12px",
          borderRadius: 20,
          background: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 20,
        }}>
          Without AI Canvas
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#ffffff" }}>
          The Old Way
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            "Spend hours in Figma/Miro",
            "Manual shape placement",
            "No AI assistance",
            "Complex export process",
            "Limited collaboration",
            "Expensive subscriptions",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <X size={14} color="#ef4444" />
              </div>
              <span style={{ fontSize: 14, color: "#6b6b80" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* With AI Canvas */}
      <div style={{
        padding: 32,
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(124,92,252,0.1) 0%, rgba(99,102,241,0.1) 100%)",
        border: "1px solid rgba(124, 92, 252, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 12px",
          borderRadius: 20,
          background: "#7c5cfc",
          color: "#ffffff",
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 20,
        }}>
          With AI Canvas ✨
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#ffffff" }}>
          The Smart Way
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            "Create diagrams in seconds",
            "AI-powered generation",
            "Natural language prompts",
            "One-click export (PNG/SVG/PDF)",
            "Real-time collaboration",
            "Free to start, affordable plans",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(124, 92, 252, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Check size={14} color="#7c5cfc" />
              </div>
              <span style={{ fontSize: 14, color: "#a0a0b8" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Glow effect */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,92,252,0.3) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}
