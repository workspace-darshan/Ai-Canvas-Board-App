// ============================================================
// Landing Page — Marketing Website (Eraser.io style)
// ============================================================

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, Check,
  Users, Download
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import ParticleBackground from "@/components/landing/ParticleBackground";
import SpotlightGlow from "@/components/landing/SpotlightGlow";
import BentoGrid from "@/components/landing/BentoGrid";
import AnimatedMarquee from "@/components/landing/AnimatedMarquee";
import SocialProof from "@/components/landing/SocialProof";
import BeforeAfter from "@/components/landing/BeforeAfter";
import FeatureTabs from "@/components/landing/FeatureTabs";
import EnhancedPricing from "@/components/landing/EnhancedPricing";
import CTABanner from "@/components/landing/CTABanner";
import IconShowcase from "@/components/landing/IconShowcase";
import ScrollytellingFeatures from "@/components/landing/ScrollytellingFeatures";
import AIShowcase from "@/components/landing/AIShowcase";
import BackgroundVectors from "@/components/landing/BackgroundVectors";
import MacCanvasMockup from "@/components/landing/MacCanvasMockup";

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const navButtonsRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler for anchor links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Smooth scroll to top for logo
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Magnetic effect for nav buttons
  useEffect(() => {
    const buttons = navButtonsRef.current.filter(Boolean) as (HTMLElement)[];

    const handlers = buttons.map((btn) => {
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as unknown as MouseEvent;
        const rect = btn.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left - rect.width / 2;
        const y = mouseEvent.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      };

      const handleMouseLeave = () => {
        btn.style.transform = "translate(0, 0)";
        btn.style.transition = "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      };

      const handleMouseEnter = () => {
        btn.style.transition = "transform 0.3s ease";
      };

      btn.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);
      btn.addEventListener("mouseenter", handleMouseEnter);

      return { btn, handleMouseMove, handleMouseLeave, handleMouseEnter };
    });

    return () => {
      handlers.forEach((handler) => {
        handler.btn.removeEventListener("mousemove", handler.handleMouseMove);
        handler.btn.removeEventListener("mouseleave", handler.handleMouseLeave);
        handler.btn.removeEventListener("mouseenter", handler.handleMouseEnter);
      });
    };
  }, []);

  return (
    <>
      {/* Interactive Components */}
      <ParticleBackground />
      <SpotlightGlow />
      <BackgroundVectors />

      <div style={{
        minHeight: "100vh",
        background: "#09090f",
        color: "#ffffff",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        zIndex: 2,
      }}>
        {/* Navbar */}
        <nav style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: isScrolled ? "rgba(9, 9, 15, 0.8)" : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          transition: "all 0.3s ease",
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            {/* Logo */}
            <Link href="/" onClick={scrollToTop} style={{
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

            {/* Desktop Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div style={{ display: "flex", gap: 24 }}>
                {["Features", "Pricing", "Docs"].map((item, i) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => handleSmoothScroll(e, item.toLowerCase())}
                    ref={(el) => { navLinksRef.current[i] = el; }}
                    className="nav-link"
                    style={{
                      color: "#a0a0b8",
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "color 0.2s",
                      position: "relative",
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <Link
                  href="/auth/login"
                  ref={(el) => { navButtonsRef.current[0] = el; }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  ref={(el) => { navButtonsRef.current[1] = el; }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    background: "#4f6ef7",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s",
                    boxShadow: "0 0 20px rgba(79, 110, 247, 0.3)",
                  }}
                >
                  Try Free <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{
          padding: "120px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Floating shapes background */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.15,
            pointerEvents: "none",
          }}>
            {/* Floating geometric shapes */}
            {[
              { shape: "circle", size: 60, top: "15%", left: "10%", duration: "6s" },
              { shape: "square", size: 40, top: "25%", right: "15%", duration: "8s" },
              { shape: "triangle", size: 50, top: "60%", left: "20%", duration: "10s" },
              { shape: "circle", size: 30, top: "70%", right: "25%", duration: "12s" },
              { shape: "square", size: 45, top: "40%", left: "80%", duration: "9s" },
              { shape: "triangle", size: 35, top: "80%", left: "70%", duration: "11s" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  width: item.size,
                  height: item.size,
                  background: item.shape === "circle" ? "#4f6ef7" : item.shape === "square" ? "#6366f1" : "transparent",
                  borderRadius: item.shape === "circle" ? "50%" : 0,
                  border: item.shape === "triangle" ? "2px solid #7c5cfc" : "none",
                  clipPath: item.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
                  animation: `floatShape ${item.duration} ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}

            <div style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)",
              animation: "float 6s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute",
              top: "60%",
              right: "15%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
              animation: "float 8s ease-in-out infinite",
              animationDelay: "2s",
            }} />
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <h1
              className="hero-headline"
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{
                background: "#6d4aff",
                padding: "2px 8px",
                borderRadius: 4,
                display: "inline-block",
              }}>
                AI-Powered
              </span>{" "}
              Drawing Board<br />
              for Technical Teams
            </h1>

            <p style={{
              fontSize: 20,
              color: "#a0a0b8",
              lineHeight: 1.6,
              marginBottom: 40,
              maxWidth: 600,
              margin: "0 auto 40px",
            }}>
              Create diagrams, flowcharts, and system designs at the{" "}
              <span style={{
                background: "#6d4aff",
                padding: "0 6px",
                borderRadius: 4,
                display: "inline",
              }}>
                speed of thought
              </span>
              . Powered by AI.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 60 }}>
              <button onClick={() => router.push("/auth/register")} style={{
                padding: "14px 32px",
                borderRadius: 10,
                background: "#4f6ef7",
                color: "#ffffff",
                border: "none",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}>
                Try for Free <ArrowRight size={18} />
              </button>
            </div>

            {/* Mac Canvas Mockup */}
            <div
              className="canvas-preview-wrapper"
              style={{
                width: "100%",
                maxWidth: 900,
                margin: "0 auto",
                position: "relative",
                minHeight: 400, // Reserve space to prevent layout shift
              }}
            >
              <MacCanvasMockup />
            </div>
          </div>
        </section>

        {/* Company Logos */}
        <section style={{
          padding: "60px 24px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <p style={{
              fontSize: 11,
              color: "#3a3a55",
              marginBottom: 32,
              textTransform: "uppercase",
              letterSpacing: "3px",
              fontWeight: 500,
            }}>
              Trusted by leading technical teams globally
            </p>
            <AnimatedMarquee />
          </div>
        </section>

        {/* Scrollytelling Features with Timeline */}
        <section style={{ padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <ScrollytellingFeatures />
        </section>

        {/* AI Showcase 3-Panel */}
        <section style={{ padding: "100px 24px", background: "#0d0d14", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, color: "#4f6ef7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              AI POWERED
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              A powerful AI tool for{" "}
              <span style={{
                background: "#6d4aff",
                padding: "2px 8px",
                borderRadius: 4,
                display: "inline-block",
              }}>
                modern developers
              </span>
            </h2>
            <p style={{ fontSize: 18, color: "#6b6b80" }}>
              Write natural language prompts to output diagram code that you can save, edit, and share with your team
            </p>
          </div>
          <AIShowcase />
        </section>

        {/* Bento Grid Features */}
        <section id="features" style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ fontSize: 11, color: "#4f6ef7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, textAlign: "center" }}>
              FEATURES
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 700, textAlign: "center", marginBottom: 60 }}>
              Everything you need to create
            </h2>
            <BentoGrid />
          </div>
        </section>

        {/* Social Proof + Stats */}
        <section style={{ padding: "100px 24px", background: "#0d0d14", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, color: "#4f6ef7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              SOCIAL PROOF
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              Trusted by thousands
            </h2>
            <p style={{ fontSize: 18, color: "#6b6b80" }}>
              Join developers and designers creating amazing diagrams
            </p>
          </div>
          <SocialProof />
        </section>

        {/* Before/After Comparison */}
        <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, color: "#4f6ef7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              COMPARISON
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              The difference is clear
            </h2>
            <p style={{ fontSize: 18, color: "#6b6b80" }}>
              See why teams are switching to AI Canvas
            </p>
          </div>
          <BeforeAfter />
        </section>

        {/* Feature Tabs */}
        <section style={{ padding: "100px 24px", background: "#0d0d14", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, color: "#4f6ef7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              CAPABILITIES
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              Powerful features, simple to use
            </h2>
            <p style={{ fontSize: 18, color: "#6b6b80" }}>
              Everything you need in one place
            </p>
          </div>
          <FeatureTabs />
        </section>

        {/* Icon Library */}
        <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#4f6ef7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              ICONS
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              5,000+ icons built in
            </h2>
            <p style={{ fontSize: 18, color: "#a0a0b8", marginBottom: 60 }}>
              From AWS to Figma — every tech icon you need
            </p>
            <IconShowcase />
          </div>
        </section>

        {/* Pricing */}
        {/* Enhanced Pricing */}
        <section id="pricing" style={{ padding: "100px 24px", background: "#0d0d14", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, color: "#4f6ef7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              PRICING
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: 18, color: "#6b6b80" }}>
              Choose the plan that's right for you
            </p>
          </div>
          <EnhancedPricing />
        </section>

        {/* CTA Banner */}
        <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <CTABanner />
        </section>

        {/* Footer */}
        <footer style={{
          padding: "60px 24px 40px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
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
                  <span style={{ fontSize: 18, fontWeight: 700 }}>AI Canvas</span>
                </div>
                <p style={{ fontSize: 14, color: "#6b6b80", lineHeight: 1.6 }}>
                  Documents & diagrams for technical teams
                </p>
              </div>

              {[
                { title: "Product", links: ["Features", "Pricing", "Docs"] },
                { title: "Company", links: ["About", "Blog", "Careers"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#a0a0b8" }}>{col.title}</h4>
                  <ul style={{ listStyle: "none" }}>
                    {col.links.map((link) => (
                      <li key={link} style={{ marginBottom: 12 }}>
                        <a href="#" style={{ fontSize: 14, color: "#6b6b80", textDecoration: "none" }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{
              paddingTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              color: "#6b6b80",
            }}>
              <p>© 2026 AI Canvas. Built by ❤️ Darshan Mevada</p>
              <div style={{ display: "flex", gap: 16 }}>
                <a href="#" style={{ color: "#6b6b80" }}><FaGithub size={20} /></a>
              </div>
            </div>
          </div>
        </footer>

      </div> {/* Close main container */}

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes floatShape {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }
        
        @keyframes borderGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(124, 92, 252, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(124, 92, 252, 0.6));
          }
        }

        .canvas-preview-wrapper:hover {
          transform: scale(1.02);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
        }

        .nav-link:hover {
          color: #ffffff !important;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #4f6ef7;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Feature cards hover */
        section > div > div:hover {
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.2) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        /* Pricing cards hover */
        .pricing-card {
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }

        /* Popular pricing card float */
        @keyframes priceFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        /* Icon items hover */
        .icon-item {
          transition: all 0.3s ease;
        }

        .icon-item:hover {
          transform: scale(1.3) rotate(5deg);
          box-shadow: 0 0 20px rgba(124, 92, 252, 0.5);
        }

        /* Button hover effects */
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(79, 110, 247, 0.4);
        }

        /* Smooth transitions for all interactive elements */
        button, a {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
}
