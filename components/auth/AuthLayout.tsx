// ============================================================
// Auth Layout — Modern design matching landing page
// ============================================================

"use client";

import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import ParticleBackground from "@/components/landing/ParticleBackground";
import SpotlightGlow from "@/components/landing/SpotlightGlow";
import BackgroundVectors from "@/components/landing/BackgroundVectors";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      {/* Interactive Components */}
      <ParticleBackground />
      <SpotlightGlow />
      <BackgroundVectors />

      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#09090f",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        zIndex: 2,
      }}>
        {/* Navbar */}
        <nav style={{
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 700,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #7c5cfc, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Sparkles size={18} color="white" />
            </div>
            AI Canvas
          </Link>

          <Link href="/" style={{
            fontSize: 14,
            color: "#a0a0b8",
            textDecoration: "none",
            transition: "color 0.2s",
          }}>
            ← Back to home
          </Link>
        </nav>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}>
          <div style={{
            width: "100%",
            maxWidth: 440,
            background: "rgba(17, 17, 24, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 40,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}>
            {children}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "20px 40px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "center",
          gap: 24,
          fontSize: 13,
          color: "#6b6b80",
        }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Help</a>
        </div>
      </div>
    </>
  );
}
