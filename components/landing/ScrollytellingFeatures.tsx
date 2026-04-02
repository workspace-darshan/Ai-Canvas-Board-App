// ============================================================
// Scrollytelling Features — Vertical timeline (Eraser.io style)
// ============================================================

"use client";

import { Monitor, Zap, Sparkles } from "lucide-react";

export default function ScrollytellingFeatures() {
  const features = [
    {
      badge: "Speed",
      icon: <Zap size={20} />,
      title: "Beautiful by default,",
      highlight: "created in seconds",
      description: "Diagram-as-code ensures that your diagrams are always legible and easily maintainable. Spend more time thinking, less time moving boxes around.",
      mockup: "canvas-diagram",
    },
    {
      badge: "Collaboration",
      icon: <Monitor size={20} />,
      title: "Real-time collaboration,",
      highlight: "zero friction",
      description: "See your team's cursors in real-time. Comment, edit, and build together. No more screenshot ping-pong or version conflicts.",
      mockup: "multi-cursor",
    },
    {
      badge: "AI",
      icon: <Sparkles size={20} />,
      title: "AI that understands",
      highlight: "your architecture",
      description: "Describe your system in plain English. Our AI generates production-ready diagrams with proper grouping, connections, and AWS icons.",
      mockup: "ai-panel",
    },
  ];

  return (
    <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
      {/* Vertical dashed line */}
      <div style={{
        position: "absolute",
        left: 40,
        top: 0,
        bottom: 0,
        width: 2,
        background: "linear-gradient(to bottom, transparent, #6d4aff 10%, #6d4aff 90%, transparent)",
        backgroundSize: "2px 20px",
        backgroundRepeat: "repeat-y",
        opacity: 0.3,
      }} />

      {/* Feature sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 120 }}>
        {features.map((feature, i) => (
          <div key={i} style={{ display: "flex", gap: 80, alignItems: "center", position: "relative" }}>
            {/* Circle node on timeline */}
            <div style={{
              position: "absolute",
              left: 24,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#6d4aff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              zIndex: 2,
            }}>
              {feature.icon}
            </div>

            {/* Left side - Content */}
            <div style={{ flex: 1, paddingLeft: 80 }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: 11,
                color: "#8080aa",
                marginBottom: 16,
              }}>
                ✦ {feature.badge}
              </div>

              {/* Headline with highlight */}
              <h3 style={{
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: 16,
              }}>
                {feature.title}{" "}
                <span style={{
                  background: "#6d4aff",
                  padding: "2px 8px",
                  borderRadius: 4,
                  display: "inline-block",
                }}>
                  {feature.highlight}
                </span>
              </h3>

              {/* Description */}
              <p style={{
                fontSize: 16,
                color: "#a0a0b8",
                lineHeight: 1.6,
                maxWidth: 500,
              }}>
                {feature.description}
              </p>
            </div>

            {/* Right side - Mockup */}
            <div style={{ flex: 1 }}>
              {feature.mockup === "canvas-diagram" && (
                <div style={{
                  background: "#0a0a14",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: 40,
                  position: "relative",
                }}>
                  {/* Simple diagram mockup */}
                  <svg width="100%" height="200" viewBox="0 0 400 200">
                    {/* Boxes */}
                    <rect x="20" y="80" width="80" height="40" rx="4" fill="none" stroke="#4f6ef7" strokeWidth="2" />
                    <text x="60" y="105" fill="#ffffff" fontSize="12" textAnchor="middle">API</text>
                    
                    <rect x="160" y="80" width="80" height="40" rx="4" fill="none" stroke="#4f6ef7" strokeWidth="2" />
                    <text x="200" y="105" fill="#ffffff" fontSize="12" textAnchor="middle">Service</text>
                    
                    <rect x="300" y="80" width="80" height="40" rx="4" fill="none" stroke="#4f6ef7" strokeWidth="2" />
                    <text x="340" y="105" fill="#ffffff" fontSize="12" textAnchor="middle">Database</text>
                    
                    {/* Arrows */}
                    <line x1="100" y1="100" x2="160" y2="100" stroke="#6b6b80" strokeWidth="2" />
                    <polygon points="160,100 155,97 155,103" fill="#6b6b80" />
                    
                    <line x1="240" y1="100" x2="300" y2="100" stroke="#6b6b80" strokeWidth="2" />
                    <polygon points="300,100 295,97 295,103" fill="#6b6b80" />
                  </svg>
                </div>
              )}

              {feature.mockup === "multi-cursor" && (
                <div style={{
                  background: "#0a0a14",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: 40,
                  position: "relative",
                  height: 200,
                }}>
                  {/* Cursor badges */}
                  <div style={{
                    position: "absolute",
                    top: 40,
                    left: 60,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      background: "#4f6ef7",
                      borderRadius: "50%",
                    }} />
                    <span style={{ fontSize: 12, color: "#4f6ef7", fontWeight: 600 }}>Darshan</span>
                  </div>

                  <div style={{
                    position: "absolute",
                    top: 100,
                    left: 180,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      background: "#a855f7",
                      borderRadius: "50%",
                    }} />
                    <span style={{ fontSize: 12, color: "#a855f7", fontWeight: 600 }}>Rahul</span>
                  </div>

                  <div style={{
                    position: "absolute",
                    top: 140,
                    left: 280,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      background: "#10b981",
                      borderRadius: "50%",
                    }} />
                    <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>Priya</span>
                  </div>

                  {/* Live indicator */}
                  <div style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: 20,
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      background: "#10b981",
                      borderRadius: "50%",
                      animation: "pulse 2s ease-in-out infinite",
                    }} />
                    <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>3 online</span>
                  </div>
                </div>
              )}

              {feature.mockup === "ai-panel" && (
                <div style={{
                  background: "#0a0a14",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: 20,
                }}>
                  {/* AI prompt */}
                  <div style={{
                    background: "#13131c",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    border: "1px solid rgba(79, 110, 247, 0.3)",
                  }}>
                    <div style={{ fontSize: 11, color: "#6b6b80", marginBottom: 6 }}>✦ AI Prompt</div>
                    <div style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.4 }}>
                      Create a microservices architecture with API gateway, 3 services, and Redis cache
                    </div>
                  </div>

                  {/* Generated output */}
                  <div style={{
                    background: "#13131c",
                    borderRadius: 8,
                    padding: 12,
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}>
                    <div style={{ fontSize: 11, color: "#10b981", marginBottom: 6 }}>✓ Generated</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["API Gateway", "Service 1", "Service 2", "Service 3", "Redis"].map((item, i) => (
                        <div key={i} style={{
                          padding: "4px 8px",
                          background: "rgba(79, 110, 247, 0.1)",
                          border: "1px solid rgba(79, 110, 247, 0.3)",
                          borderRadius: 4,
                          fontSize: 10,
                          color: "#4f6ef7",
                        }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
