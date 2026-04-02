// ============================================================
// Enhanced Pricing — Monthly/Annual toggle
// ============================================================

"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

export default function EnhancedPricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Perfect for trying out",
      features: [
        "3 boards",
        "Basic AI generation",
        "PNG export",
        "Community support",
        "5000+ icons",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: 499,
      annualPrice: 4990,
      description: "For professionals",
      features: [
        "Unlimited boards",
        "Advanced AI features",
        "All export formats (PNG/SVG/PDF/JSON)",
        "Priority support",
        "Version history",
        "Real-time collaboration",
        "Custom templates",
        "API access",
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Team",
      monthlyPrice: 999,
      annualPrice: 9990,
      description: "For growing teams",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Admin controls",
        "SSO authentication",
        "Advanced permissions",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Toggle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        marginBottom: 60,
      }}>
        <span style={{
          fontSize: 16,
          color: isAnnual ? "#6b6b80" : "#ffffff",
          fontWeight: 600,
        }}>
          Monthly
        </span>
        
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="clickable"
          style={{
            width: 56,
            height: 32,
            borderRadius: 16,
            background: isAnnual ? "#7c5cfc" : "#2a2a38",
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s",
          }}
        >
          <div style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#ffffff",
            position: "absolute",
            top: 4,
            left: isAnnual ? 28 : 4,
            transition: "all 0.3s",
          }} />
        </button>
        
        <span style={{
          fontSize: 16,
          color: isAnnual ? "#ffffff" : "#6b6b80",
          fontWeight: 600,
        }}>
          Annual
        </span>
        
        {isAnnual && (
          <span style={{
            padding: "4px 12px",
            borderRadius: 20,
            background: "rgba(52, 211, 153, 0.1)",
            color: "#34d399",
            fontSize: 12,
            fontWeight: 600,
          }}>
            Save 17%
          </span>
        )}
      </div>

      {/* Pricing Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24,
      }}>
        {plans.map((plan, i) => (
          <div
            key={i}
            className="pricing-card"
            style={{
              padding: 32,
              borderRadius: 16,
              background: plan.popular
                ? "linear-gradient(135deg, rgba(124,92,252,0.1) 0%, rgba(99,102,241,0.1) 100%)"
                : "#13131c",
              border: plan.popular
                ? "2px solid #7c5cfc"
                : "1px solid rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "4px 16px",
                borderRadius: 20,
                background: "#7c5cfc",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <Sparkles size={12} />
                Most Popular
              </div>
            )}

            {/* Plan Name */}
            <h3 style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 8,
              color: "#ffffff",
            }}>
              {plan.name}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: 14,
              color: "#6b6b80",
              marginBottom: 24,
            }}>
              {plan.description}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#ffffff",
                }}>
                  ₹{isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                </span>
                <span style={{
                  fontSize: 16,
                  color: "#6b6b80",
                }}>
                  /month
                </span>
              </div>
              {isAnnual && plan.annualPrice > 0 && (
                <div style={{
                  fontSize: 13,
                  color: "#6b6b80",
                  marginTop: 4,
                }}>
                  Billed annually (₹{plan.annualPrice}/year)
                </div>
              )}
            </div>

            {/* Features */}
            <ul style={{
              listStyle: "none",
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              {plan.features.map((feature, j) => (
                <li key={j} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: "#a0a0b8",
                }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(124, 92, 252, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Check size={12} color="#7c5cfc" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className="clickable"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                background: plan.popular ? "#7c5cfc" : "transparent",
                border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.15)",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
