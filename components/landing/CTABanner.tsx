// ============================================================
// CTA Banner — Final conversion push
// ============================================================

"use client";

import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTABanner() {
  const router = useRouter();

  return (
    <div style={{
      maxWidth: 1000,
      margin: "0 auto",
      padding: 60,
      borderRadius: 20,
      background: "linear-gradient(135deg, #7c5cfc 0%, #6366f1 100%)",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}>
      {/* Gradient orbs */}
      <div style={{
        position: "absolute",
        top: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <h2 style={{
          fontSize: 42,
          fontWeight: 800,
          color: "#ffffff",
          marginBottom: 16,
          letterSpacing: "-0.02em",
        }}>
          Ready to create amazing diagrams?
        </h2>
        
        <p style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.9)",
          marginBottom: 32,
          maxWidth: 600,
          margin: "0 auto 32px",
        }}>
          Join 10,000+ developers and designers using AI Canvas to build better diagrams faster.
        </p>

        {/* Benefits */}
        <div style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          marginBottom: 32,
          flexWrap: "wrap",
        }}>
          {[
            "No credit card required",
            "Free forever plan",
            "Cancel anytime",
          ].map((benefit, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 500,
            }}>
              <Check size={16} />
              {benefit}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/auth/register")}
          className="clickable"
          style={{
            padding: "16px 40px",
            borderRadius: 12,
            background: "#ffffff",
            color: "#7c5cfc",
            border: "none",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            transition: "all 0.3s",
          }}
        >
          Start Creating Free
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
