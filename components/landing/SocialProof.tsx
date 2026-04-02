// ============================================================
// Social Proof — Stats + Testimonials
// ============================================================

"use client";

import { Star } from "lucide-react";

export default function SocialProof() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 32,
        marginBottom: 60,
      }}>
        {[
          { value: "10,000+", label: "Active Users", color: "#7c5cfc" },
          { value: "50,000+", label: "Boards Created", color: "#6366f1" },
          { value: "4.9/5", label: "User Rating", color: "#fbbf24" },
          { value: "99.9%", label: "Uptime", color: "#34d399" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 48,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 14, color: "#6b6b80" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: 24,
      }}>
        {[
          {
            quote: "AI Canvas replaced Figma and Miro for our entire engineering team. The AI diagram generation is mind-blowing.",
            author: "Rahul Sharma",
            role: "Senior Engineer @ TechCorp",
            avatar: "linear-gradient(135deg, #7c5cfc, #6366f1)",
          },
          {
            quote: "Best diagramming tool I've used. Real-time collaboration actually works, and the export quality is perfect.",
            author: "Priya Patel",
            role: "Product Designer @ StartupXYZ",
            avatar: "linear-gradient(135deg, #6366f1, #34d399)",
          },
        ].map((testimonial, i) => (
          <div key={i} style={{
            padding: 32,
            borderRadius: 16,
            background: "#13131c",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            {/* Stars */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} fill="#fbbf24" color="#fbbf24" />
              ))}
            </div>

            {/* Quote */}
            <p style={{
              fontSize: 15,
              color: "#a0a0b8",
              lineHeight: 1.6,
              marginBottom: 20,
            }}>
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: testimonial.avatar,
              }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
                  {testimonial.author}
                </div>
                <div style={{ fontSize: 13, color: "#6b6b80" }}>
                  {testimonial.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
