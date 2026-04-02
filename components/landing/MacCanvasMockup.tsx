// ============================================================
// Mac Canvas Mockup — Real app inside Mac browser frame
// ============================================================

"use client";

export default function MacCanvasMockup() {
  return (
    <div style={{
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      background: "#0a0a14",
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.05), 0 40px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(79, 110, 247, 0.08)",
    }}>
      {/* Mac title bar */}
      <div style={{
        background: "#141420",
        borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
        height: 36,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 12,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", display: "inline-block", background: "#FF5F57" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", display: "inline-block", background: "#FFBD2E" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", display: "inline-block", background: "#28C840" }} />
        </div>
        <div style={{
          fontSize: 11,
          color: "#3a3a55",
          fontFamily: "monospace",
          background: "#0f0f1a",
          padding: "3px 12px",
          borderRadius: 4,
          margin: "0 auto",
        }}>
          app.aicanvas.io/board/system-design
        </div>
      </div>

      {/* App top bar */}
      <div style={{
        background: "#0d0d1a",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        height: 44,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#4f6ef7" }}>✦ AI Canvas</div>
        <div style={{ fontSize: 13, color: "#e0e0f0", fontWeight: 500 }}>System Architecture</div>
        <div style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div className="undo-btn">↩</div>
          <div className="redo-btn">↪</div>
          <div className="zoom">100%</div>
          <div style={{ display: "flex" }}>
            <div className="avatar" style={{ background: "#4f6ef7", width: 26, height: 26, borderRadius: "50%", fontSize: 11, fontWeight: 700, color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0d0d1a" }}>D</div>
            <div className="avatar" style={{ background: "#a855f7", width: 26, height: 26, borderRadius: "50%", fontSize: 11, fontWeight: 700, color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0d0d1a", marginLeft: -8 }}>R</div>
          </div>
          <div className="share-btn">Share</div>
        </div>
      </div>

      {/* App body: sidebar + canvas */}
      <div style={{ display: "flex", height: 320 }}>
        {/* LEFT TOOLBAR */}
        <div style={{
          width: 48,
          background: "#0d0d1a",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
          gap: 4,
        }}>
          <div className="tool active">↖</div>
          <div className="tool">✋</div>
          <div className="tool">✏️</div>
          <div className="tool">→</div>
          <div className="tool separator" />
          <div className="tool">□</div>
          <div className="tool">○</div>
          <div className="tool">◇</div>
          <div className="tool">T</div>
          <div className="tool separator" />
          <div className="tool">☺</div>
        </div>

        {/* CANVAS AREA */}
        <div style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "#08080f",
        }}>
          {/* The actual diagram SVG */}
          <svg className="diagram-svg" viewBox="0 0 800 320">
            {/* Background dot grid pattern */}
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.08)" />
              </pattern>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.3)" />
              </marker>
              <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4f6ef7" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* GROUP BOX: Backend cluster */}
            <rect
              x="400"
              y="60"
              width="340"
              height="220"
              rx="10"
              fill="rgba(79,110,247,0.06)"
              stroke="rgba(79,110,247,0.3)"
              strokeWidth="1.5"
              strokeDasharray="6,4"
            />
            <text x="415" y="85" fill="rgba(79,110,247,0.7)" fontSize="10" fontFamily="monospace">
              BACKEND CLUSTER
            </text>

            {/* NODES with icons */}
            {/* Load Balancer */}
            <g className="node" transform="translate(80, 80)">
              <rect width="130" height="56" rx="8" fill="#0f0f1a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <text x="16" y="24" fontSize="16">⚖️</text>
              <text x="40" y="28" fill="white" fontSize="12" fontWeight="500">Load Balancer</text>
              <text x="40" y="42" fill="#55556a" fontSize="10">nginx</text>
            </g>

            {/* API Gateway */}
            <g className="node" transform="translate(80, 190)">
              <rect width="130" height="56" rx="8" fill="#0f0f1a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <text x="16" y="24" fontSize="16">🔀</text>
              <text x="40" y="28" fill="white" fontSize="12" fontWeight="500">API Gateway</text>
              <text x="40" y="42" fill="#55556a" fontSize="10">express</text>
            </g>

            {/* Backend Service (selected - blue border) */}
            <g className="node" transform="translate(430, 100)">
              <rect width="140" height="60" rx="8" fill="#0d0f20" stroke="#4f6ef7" strokeWidth="2" />
              <text x="16" y="26" fontSize="16">⚙️</text>
              <text x="40" y="30" fill="white" fontSize="12" fontWeight="600">Backend Service</text>
              <text x="40" y="46" fill="#55556a" fontSize="10">node.js</text>
            </g>

            {/* Database (green border) */}
            <g className="node" transform="translate(430, 200)">
              <rect width="130" height="56" rx="8" fill="#0a1410" stroke="#22c55e" strokeWidth="1.5" />
              <text x="16" y="24" fontSize="16">🗄️</text>
              <text x="40" y="28" fill="white" fontSize="12" fontWeight="500">Database</text>
              <text x="40" y="42" fill="#55556a" fontSize="10">mongodb</text>
            </g>

            {/* Redis (orange border) */}
            <g className="node" transform="translate(600, 200)">
              <rect width="110" height="56" rx="8" fill="#130a08" stroke="#f97316" strokeWidth="1.5" />
              <text x="14" y="24" fontSize="16">⚡</text>
              <text x="36" y="28" fill="white" fontSize="12" fontWeight="500">Redis</text>
              <text x="36" y="42" fill="#55556a" fontSize="10">cache</text>
            </g>

            {/* ARROWS between nodes */}
            {/* LB → API Gateway */}
            <line x1="145" y1="136" x2="145" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* API → Backend */}
            <path d="M210,218 L430,130" fill="none" stroke="#4f6ef7" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

            {/* Backend → DB */}
            <line x1="500" y1="160" x2="495" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* DB → Redis */}
            <line x1="560" y1="228" x2="600" y2="228" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* ANIMATED CURSORS */}
            {/* Cursor 1: Darshan (blue) */}
            <g className="cursor-darshan">
              <polygon points="0,0 0,18 5,14 8,20 11,19 8,13 14,13" fill="#4f6ef7" />
              <rect x="14" y="10" width="52" height="18" rx="4" fill="#4f6ef7" />
              <text x="18" y="23" fill="white" fontSize="10" fontWeight="600">Darshan</text>
            </g>

            {/* Cursor 2: Rahul (purple) */}
            <g className="cursor-rahul">
              <polygon points="0,0 0,18 5,14 8,20 11,19 8,13 14,13" fill="#a855f7" />
              <rect x="14" y="10" width="44" height="18" rx="4" fill="#a855f7" />
              <text x="18" y="23" fill="white" fontSize="10" fontWeight="600">Rahul</text>
            </g>
          </svg>

          {/* AI PROMPT BAR at bottom of canvas */}
          <div className="ai-prompt-bar">
            <span className="ai-icon">✦</span>
            <span className="ai-typing">add authentication service...</span>
            <span className="cursor-blink">|</span>
          </div>

          {/* Page indicator bottom left */}
          <div className="page-indicator">Page 1 ∨</div>
        </div>
      </div>

      <style jsx>{`
        .mac-frame {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0a0a14;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 40px 80px rgba(0, 0, 0, 0.6),
            0 0 60px rgba(79, 110, 247, 0.08);
        }

        .mac-titlebar {
          background: #141420;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          height: 36px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 12px;
        }

        .mac-dots {
          display: flex;
          gap: 6px;
        }

        .mac-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .mac-url {
          font-size: 11px;
          color: #3a3a55;
          font-family: monospace;
          background: #0f0f1a;
          padding: 3px 12px;
          border-radius: 4px;
          margin: 0 auto;
        }

        .app-topbar {
          background: #0d0d1a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          height: 44px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 16px;
        }

        .app-logo {
          font-size: 14px;
          font-weight: 700;
          color: #4f6ef7;
        }

        .board-name {
          font-size: 13px;
          color: #e0e0f0;
          font-weight: 500;
        }

        .topbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .undo-btn,
        .redo-btn,
        .zoom {
          font-size: 12px;
          color: #55556a;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .undo-btn:hover,
        .redo-btn:hover,
        .zoom:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #a0a0b8;
        }

        .share-btn {
          background: #4f6ef7;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .share-btn:hover {
          background: #5b7ef8;
        }

        .collab-avatars {
          display: flex;
        }

        .avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0d0d1a;
          margin-left: -8px;
        }

        .avatar:first-child {
          margin-left: 0;
        }

        .app-body {
          display: flex;
          height: 320px;
        }

        .toolbar {
          width: 48px;
          background: #0d0d1a;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
          gap: 4px;
        }

        .tool {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #55556a;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tool:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #a0a0b8;
        }

        .tool.active {
          background: rgba(79, 110, 247, 0.15);
          color: #4f6ef7;
        }

        .tool.separator {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          width: 24px;
          margin: 4px 0;
          cursor: default;
        }

        .canvas-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #08080f;
        }

        .diagram-svg {
          width: 100%;
          height: 100%;
        }

        .ai-prompt-bar {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          background: #13131f;
          border: 1px solid rgba(79, 110, 247, 0.3);
          border-radius: 24px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #7070a0;
          min-width: 260px;
          box-shadow: 0 0 20px rgba(79, 110, 247, 0.1);
        }

        .ai-icon {
          color: #4f6ef7;
          font-size: 14px;
        }

        .ai-typing {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 3s steps(30) infinite alternate;
        }

        .cursor-blink {
          animation: blink 0.8s infinite;
          color: #4f6ef7;
        }

        .page-indicator {
          position: absolute;
          bottom: 14px;
          left: 14px;
          font-size: 11px;
          color: #3a3a55;
          background: #13131f;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          padding: 3px 8px;
        }

        .cursor-darshan {
          animation: moveDarshan 8s ease-in-out infinite;
        }

        .cursor-rahul {
          animation: moveRahul 10s ease-in-out infinite;
        }

        @keyframes moveDarshan {
          0% {
            transform: translate(200px, 160px);
          }
          20% {
            transform: translate(460px, 120px);
          }
          40% {
            transform: translate(530px, 210px);
          }
          60% {
            transform: translate(620px, 210px);
          }
          80% {
            transform: translate(300px, 100px);
          }
          100% {
            transform: translate(200px, 160px);
          }
        }

        @keyframes moveRahul {
          0% {
            transform: translate(460px, 200px);
          }
          25% {
            transform: translate(150px, 110px);
          }
          50% {
            transform: translate(640px, 130px);
          }
          75% {
            transform: translate(480px, 240px);
          }
          100% {
            transform: translate(460px, 200px);
          }
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 180px;
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
