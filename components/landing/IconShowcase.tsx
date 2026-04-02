// ============================================================
// Icon Showcase — Infinite scroll marquee with real icons
// ============================================================

"use client";

import { useEffect } from "react";

export default function IconShowcase() {
  useEffect(() => {
    // Load Iconify
    const script = document.createElement("script");
    script.src = "https://code.iconify.design/3/3.1.1/iconify.min.js";
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const row1Icons = [
    { icon: "logos:react", name: "React" },
    { icon: "logos:nextjs-icon", name: "Next.js" },
    { icon: "logos:nodejs-icon", name: "Node.js" },
    { icon: "logos:docker-icon", name: "Docker" },
    { icon: "logos:aws", name: "AWS" },
    { icon: "logos:google-cloud", name: "GCP" },
    { icon: "logos:azure-icon", name: "Azure" },
    { icon: "logos:kubernetes", name: "Kubernetes" },
    { icon: "logos:mongodb-icon", name: "MongoDB" },
    { icon: "logos:redis", name: "Redis" },
    { icon: "logos:postgresql", name: "PostgreSQL" },
    { icon: "logos:graphql", name: "GraphQL" },
    { icon: "logos:typescript-icon", name: "TypeScript" },
    { icon: "logos:python", name: "Python" },
    { icon: "logos:github-icon", name: "GitHub" },
    { icon: "logos:figma", name: "Figma" },
  ];

  const row2Icons = [
    { icon: "logos:vue", name: "Vue" },
    { icon: "logos:angular-icon", name: "Angular" },
    { icon: "logos:svelte-icon", name: "Svelte" },
    { icon: "logos:tailwindcss-icon", name: "Tailwind" },
    { icon: "logos:vercel-icon", name: "Vercel" },
    { icon: "logos:netlify", name: "Netlify" },
    { icon: "logos:cloudflare", name: "Cloudflare" },
    { icon: "logos:firebase", name: "Firebase" },
    { icon: "logos:prisma", name: "Prisma" },
    { icon: "logos:supabase-icon", name: "Supabase" },
    { icon: "logos:stripe", name: "Stripe" },
    { icon: "logos:slack-icon", name: "Slack" },
    { icon: "logos:notion-icon", name: "Notion" },
    { icon: "logos:linear", name: "Linear" },
    { icon: "logos:jira", name: "Jira" },
  ];

  const row3Icons = [
    { icon: "logos:rust", name: "Rust" },
    { icon: "logos:go", name: "Go" },
    { icon: "logos:java", name: "Java" },
    { icon: "logos:php", name: "PHP" },
    { icon: "logos:flutter", name: "Flutter" },
    { icon: "logos:swift", name: "Swift" },
    { icon: "logos:kotlin", name: "Kotlin" },
    { icon: "logos:dart", name: "Dart" },
    { icon: "logos:jenkins", name: "Jenkins" },
    { icon: "logos:terraform-icon", name: "Terraform" },
    { icon: "logos:ansible", name: "Ansible" },
    { icon: "logos:grafana", name: "Grafana" },
    { icon: "logos:prometheus", name: "Prometheus" },
    { icon: "logos:elasticsearch", name: "Elastic" },
    { icon: "logos:kafka-icon", name: "Kafka" },
  ];

  const IconCard = ({ icon, name }: { icon: string; name: string }) => (
    <div className="icon-card" style={{
      width: 80,
      height: 96,
      padding: 16,
      borderRadius: 12,
      background: "#0f0f1a",
      border: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      flexShrink: 0,
      transition: "all 0.3s",
    }}>
      <span className="iconify" data-icon={icon} data-width="32" />
      <span style={{ fontSize: 10, color: "#555570", textAlign: "center" }}>{name}</span>
    </div>
  );

  return (
    <div style={{ width: "100%", overflow: "hidden", position: "relative" }}>
      {/* Fake search bar */}
      <div style={{
        maxWidth: 600,
        margin: "0 auto 32px",
        padding: "12px 20px",
        borderRadius: 12,
        background: "#0f0f1a",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
        <span style={{ fontSize: 14, color: "#555570" }}>Search icons...</span>
      </div>

      {/* Category pills */}
      <div style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        marginBottom: 40,
        flexWrap: "wrap",
      }}>
        {["All", "Cloud", "Tech", "Brands", "Network"].map((cat, i) => (
          <div key={cat} style={{
            padding: "6px 16px",
            borderRadius: 20,
            background: i === 0 ? "#4f6ef7" : "#0f0f1a",
            border: `1px solid ${i === 0 ? "#4f6ef7" : "rgba(255,255,255,0.08)"}`,
            fontSize: 13,
            fontWeight: 600,
            color: i === 0 ? "#ffffff" : "#6b6b80",
          }}>
            {cat}
          </div>
        ))}
      </div>

      {/* Marquee rows */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}>
        {/* Row 1 - Left scroll */}
        <div className="marquee-container">
          <div className="marquee-track" style={{ display: "flex", gap: 12 }}>
            {[...row1Icons, ...row1Icons].map((item, i) => (
              <IconCard key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right scroll */}
        <div className="marquee-container">
          <div className="marquee-track reverse" style={{ display: "flex", gap: 12 }}>
            {[...row2Icons, ...row2Icons].map((item, i) => (
              <IconCard key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Row 3 - Slow left scroll */}
        <div className="marquee-container">
          <div className="marquee-track slow" style={{ display: "flex", gap: 12 }}>
            {[...row3Icons, ...row3Icons].map((item, i) => (
              <IconCard key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <p style={{ fontSize: 14, color: "#6b6b80", marginBottom: 16 }}>
          + 195,000 more icons available in the app
        </p>
        <button style={{
          padding: "10px 24px",
          borderRadius: 8,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}>
          Explore Icon Library →
        </button>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: scrollLeft 25s linear infinite;
          width: max-content;
        }
        
        .marquee-track.reverse {
          animation: scrollRight 30s linear infinite;
        }
        
        .marquee-track.slow {
          animation: scrollLeft 40s linear infinite;
        }
        
        @keyframes scrollLeft {
          to {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scrollRight {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .icon-card:hover {
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
