// ============================================================
// AI Showcase — 3-panel layout (Eraser.io style)
// ============================================================

"use client";

export default function AIShowcase() {
  return (
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 20,
    }}>
      {/* Left Panel - Prompt Input */}
      <div style={{
        background: "#0d0d14",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", marginBottom: 8 }}>
          Diagram Type
        </div>
        
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {["Cloud", "Flow", "ERD", "Sequence"].map((tab, i) => (
            <div key={tab} style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: i === 0 ? "#4f6ef7" : "#13131c",
              border: `1px solid ${i === 0 ? "#4f6ef7" : "rgba(255,255,255,0.08)"}`,
              fontSize: 12,
              fontWeight: 600,
              color: i === 0 ? "#ffffff" : "#6b6b80",
              cursor: "pointer",
            }}>
              {tab}
            </div>
          ))}
        </div>

        {/* Text area */}
        <div style={{
          background: "#13131c",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 16,
          minHeight: 200,
          fontSize: 13,
          color: "#a0a0b8",
          lineHeight: 1.6,
        }}>
          Create a video processing pipeline. Use ACME CORP's architecture guidelines.
          <br /><br />
          Add post-processing notification step.
          <br /><br />
          Add a CloudFront CDN.
        </div>

        {/* Generate button */}
        <button style={{
          padding: "12px 24px",
          borderRadius: 8,
          background: "#4f6ef7",
          color: "#ffffff",
          border: "none",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          ✦ Generate Diagram
        </button>
      </div>

      {/* Middle Panel - Generated Code */}
      <div style={{
        background: "#0d0d14",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
          Generated Code
        </div>

        {/* Code output */}
        <div style={{
          background: "#080812",
          borderRadius: 8,
          padding: 16,
          fontFamily: "monospace",
          fontSize: 11,
          color: "#a0a0b8",
          lineHeight: 1.8,
          overflow: "auto",
          flex: 1,
        }}>
          <div><span style={{ color: "#6b6b80" }}>// define groups and nodes</span></div>
          <div><span style={{ color: "#4f6ef7" }}>API gateway</span> <span style={{ color: "#6b6b80" }}>[icon: aws-api-gateway]</span></div>
          <div><span style={{ color: "#a855f7" }}>VPC Subnet</span> <span style={{ color: "#6b6b80" }}>[icon: aws-vpc]</span> {`{`}</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: "#10b981" }}>Main Server</span> <span style={{ color: "#6b6b80" }}>[icon: aws-ec2]</span></div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: "#f59e0b" }}>Data</span> <span style={{ color: "#6b6b80" }}>[icon: aws-rds]</span></div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: "#ec4899" }}>Queue</span> <span style={{ color: "#6b6b80" }}>[icon: aws-sqs]</span></div>
          <div>{`}`}</div>
          <div style={{ marginTop: 12 }}><span style={{ color: "#6b6b80" }}>// define connections</span></div>
          <div><span style={{ color: "#4f6ef7" }}>API gateway</span> → <span style={{ color: "#10b981" }}>Server</span> → <span style={{ color: "#f59e0b" }}>Data</span></div>
          <div><span style={{ color: "#10b981" }}>Server</span> → <span style={{ color: "#ec4899" }}>Queue</span></div>
        </div>
      </div>

      {/* Right Panel - Visual Output */}
      <div style={{
        background: "#0d0d14",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
          Visual Diagram
        </div>

        {/* Diagram output */}
        <div style={{
          background: "#080812",
          borderRadius: 8,
          padding: 20,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="100%" height="280" viewBox="0 0 300 280">
            {/* VPC Subnet Group */}
            <rect x="80" y="80" width="200" height="180" rx="8" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
            <text x="90" y="70" fill="#a855f7" fontSize="10" fontWeight="600">VPC SUBNET</text>

            {/* API Gateway */}
            <rect x="20" y="140" width="50" height="40" rx="6" fill="#4f6ef7" />
            <text x="45" y="165" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="600">API</text>

            {/* Main Server */}
            <rect x="120" y="100" width="50" height="40" rx="6" fill="#10b981" />
            <text x="145" y="125" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="600">Server</text>

            {/* Data */}
            <rect x="210" y="100" width="50" height="40" rx="6" fill="#f59e0b" />
            <text x="235" y="125" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="600">Data</text>

            {/* Queue */}
            <rect x="120" y="200" width="50" height="40" rx="6" fill="#ec4899" />
            <text x="145" y="225" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="600">Queue</text>

            {/* Arrows */}
            <line x1="70" y1="160" x2="120" y2="120" stroke="#6b6b80" strokeWidth="2" />
            <polygon points="120,120 115,122 117,127" fill="#6b6b80" />

            <line x1="170" y1="120" x2="210" y2="120" stroke="#6b6b80" strokeWidth="2" />
            <polygon points="210,120 205,117 205,123" fill="#6b6b80" />

            <line x1="145" y1="140" x2="145" y2="200" stroke="#6b6b80" strokeWidth="2" />
            <polygon points="145,200 142,195 148,195" fill="#6b6b80" />
          </svg>
        </div>
      </div>
    </div>
  );
}
