// ============================================================
// Company Logos — Static display with consistent sizing
// ============================================================

"use client";

export default function AnimatedMarquee() {
  const companies = [
    { name: "Microsoft", color: "#00A4EF" },
    { name: "Amazon", color: "#FF9900" },
    { name: "Google", color: "#4285F4" },
    { name: "Netflix", color: "#E50914" },
    { name: "Airbnb", color: "#FF5A5F" },
    { name: "Spotify", color: "#1DB954" },
    { name: "Slack", color: "#4A154B" },
    { name: "Notion", color: "#000000" },
    { name: "Figma", color: "#F24E1E" },
    { name: "Stripe", color: "#635BFF" },
    { name: "Shopify", color: "#96BF48" },
    { name: "Meta", color: "#0668E1" },
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 48,
      flexWrap: "wrap",
      maxWidth: 900,
      margin: "0 auto",
    }}>
      {companies.map((company, i) => (
        <div
          key={i}
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#555570",
            opacity: 0.4,
            transition: "opacity 0.3s",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.4";
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: company.color,
            }}
          />
          {company.name}
        </div>
      ))}
    </div>
  );
}
