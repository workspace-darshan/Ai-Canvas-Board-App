// ============================================================
// Feature Tabs — Interactive showcase
// ============================================================

"use client";

import { useState } from "react";
import { Sparkles, Users, Download, Zap } from "lucide-react";

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: <Sparkles size={20} />,
      title: "AI Generation",
      description: "Describe your diagram in plain English and watch AI create it instantly",
      preview: "🤖 AI-powered diagram generation with natural language processing",
    },
    {
      icon: <Users size={20} />,
      title: "Collaboration",
      description: "Work together in real-time with live cursors and instant sync",
      preview: "👥 Real-time multiplayer canvas with presence indicators",
    },
    {
      icon: <Download size={20} />,
      title: "Export",
      description: "Export to PNG, SVG, PDF, or JSON with one click",
      preview: "📦 Multi-format export with high-quality rendering",
    },
    {
      icon: <Zap size={20} />,
      title: "Performance",
      description: "Lightning-fast rendering with 60fps smooth interactions",
      preview: "⚡ Optimized canvas engine with instant response",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 40,
        overflowX: "auto",
        paddingBottom: 8,
      }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className="clickable"
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              background: activeTab === i ? "#7c5cfc" : "#13131c",
              border: `1px solid ${activeTab === i ? "#7c5cfc" : "rgba(255,255,255,0.08)"}`,
              color: activeTab === i ? "#ffffff" : "#a0a0b8",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.3s",
              whiteSpace: "nowrap",
            }}
          >
            {tab.icon}
            {tab.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        alignItems: "center",
      }}>
        {/* Description */}
        <div>
          <h3 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 16,
            color: "#ffffff",
          }}>
            {tabs[activeTab].title}
          </h3>
          <p style={{
            fontSize: 18,
            color: "#a0a0b8",
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            {tabs[activeTab].description}
          </p>
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: "#13131c",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 14,
            color: "#6b6b80",
          }}>
            {tabs[activeTab].preview}
          </div>
        </div>

        {/* Preview */}
        <div style={{
          height: 300,
          borderRadius: 16,
          background: "linear-gradient(135deg, #1a1a24 0%, #13131c 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            fontSize: 64,
            opacity: 0.3,
          }}>
            {tabs[activeTab].icon}
          </div>
          
          {/* Animated gradient */}
          <div style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,92,252,0.2) 0%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite",
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
