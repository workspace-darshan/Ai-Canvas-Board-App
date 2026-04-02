// ============================================================
// Bento Grid — Linear/Vercel 2025 style feature showcase
// ============================================================

"use client";

import { Sparkles, Zap, Users, Code2, Wand2, GitBranch } from "lucide-react";

export default function BentoGrid() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 16,
      maxWidth: 1200,
      margin: "0 auto",
    }}>
      {/* Large AI Feature Card */}
      <div className="feature-card" style={{
        gridColumn: "span 4",
        gridRow: "span 2",
        padding: 32,
        borderRadius: 16,
        background: "linear-gradient(135deg, #1a1a24 0%, #13131c 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(135deg, #7c5cfc, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}>
            <Wand2 size={24} color="white" />
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#ffffff" }}>
            AI-Powered Diagram Generation
          </h3>
          <p style={{ fontSize: 15, color: "#a0a0b8", marginBottom: 24, lineHeight: 1.6 }}>
            Describe your system architecture in plain English. Watch as AI generates professional flowcharts, sequence diagrams, and system designs in seconds.
          </p>
          
          {/* Code Preview */}
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: "#0d0d14",
            border: "1px solid rgba(255,255,255,0.05)",
            fontFamily: "monospace",
            fontSize: 13,
          }}>
            <div style={{ color: "#6b6b80", marginBottom: 8 }}>// AI Prompt</div>
            <div style={{ color: "#7c5cfc" }}>"Create a microservices architecture</div>
            <div style={{ color: "#7c5cfc", marginLeft: 20 }}>with API gateway, auth service,</div>
            <div style={{ color: "#7c5cfc", marginLeft: 20 }}>and database"</div>
            <div style={{ color: "#34d399", marginTop: 12 }}>✓ Generated in 2.3s</div>
          </div>
        </div>
        
        {/* Gradient overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: "radial-gradient(circle at top right, rgba(124,92,252,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Real-time Collaboration */}
      <div className="feature-card" style={{
        gridColumn: "span 2",
        padding: 24,
        borderRadius: 16,
        background: "#13131c",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(99, 102, 241, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}>
          <Users size={20} color="#6366f1" />
        </div>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#ffffff" }}>
          Real-time Collaboration
        </h4>
        <p style={{ fontSize: 14, color: "#6b6b80", lineHeight: 1.5 }}>
          See live cursors, instant updates, and collaborate with your team in real-time.
        </p>
        
        {/* Live cursor indicators */}
        <div style={{ display: "flex", gap: -8, marginTop: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 60%), hsl(${i * 60 + 30}, 70%, 50%))`,
              border: "2px solid #13131c",
            }} />
          ))}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#1a1a24",
            border: "2px solid #13131c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#6b6b80",
          }}>
            +5
          </div>
        </div>
      </div>

      {/* Lightning Fast */}
      <div className="feature-card" style={{
        gridColumn: "span 2",
        padding: 24,
        borderRadius: 16,
        background: "#13131c",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(251, 191, 36, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}>
          <Zap size={20} color="#fbbf24" />
        </div>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#ffffff" }}>
          Lightning Fast
        </h4>
        <p style={{ fontSize: 14, color: "#6b6b80", lineHeight: 1.5 }}>
          Instant canvas rendering with 60fps performance. No lag, no delays.
        </p>
        <div style={{ marginTop: 16, fontSize: 24, fontWeight: 700, color: "#fbbf24" }}>
          &lt;100ms
        </div>
      </div>

      {/* Version Control */}
      <div className="feature-card" style={{
        gridColumn: "span 2",
        padding: 24,
        borderRadius: 16,
        background: "#13131c",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(52, 211, 153, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}>
          <GitBranch size={20} color="#34d399" />
        </div>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#ffffff" }}>
          Version History
        </h4>
        <p style={{ fontSize: 14, color: "#6b6b80", lineHeight: 1.5 }}>
          Never lose work. Full version history with one-click restore.
        </p>
      </div>

      {/* Export Anywhere */}
      <div className="feature-card" style={{
        gridColumn: "span 2",
        padding: 24,
        borderRadius: 16,
        background: "#13131c",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(124, 92, 252, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}>
          <Code2 size={20} color="#7c5cfc" />
        </div>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#ffffff" }}>
          Export Anywhere
        </h4>
        <p style={{ fontSize: 14, color: "#6b6b80", lineHeight: 1.5 }}>
          PNG, SVG, PDF, JSON. Use your diagrams everywhere.
        </p>
      </div>
    </div>
  );
}
