// ============================================================
// Background Vectors — Scattered geometric shapes (Eraser.io style)
// ============================================================

"use client";

export default function BackgroundVectors() {
  const shapes = [
    { type: "triangle", top: "10%", left: "5%", size: 40, rotation: 45, opacity: 0.08 },
    { type: "circle", top: "15%", right: "10%", size: 30, opacity: 0.06 },
    { type: "curve", top: "25%", left: "15%", size: 60, rotation: 120, opacity: 0.1 },
    { type: "triangle", top: "40%", right: "8%", size: 35, rotation: 180, opacity: 0.07 },
    { type: "circle", top: "55%", left: "8%", size: 25, opacity: 0.09 },
    { type: "curve", top: "65%", right: "12%", size: 50, rotation: 270, opacity: 0.08 },
    { type: "triangle", top: "75%", left: "20%", size: 45, rotation: 90, opacity: 0.06 },
    { type: "circle", top: "85%", right: "15%", size: 35, opacity: 0.1 },
  ];

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      zIndex: 1,
      overflow: "hidden",
    }}>
      {shapes.map((shape, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: shape.top,
            left: shape.left,
            right: shape.right,
            width: shape.size,
            height: shape.size,
            opacity: shape.opacity,
            transform: `rotate(${shape.rotation || 0}deg)`,
          }}
        >
          {shape.type === "triangle" && (
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="#6d4aff" strokeWidth="2" />
            </svg>
          )}
          
          {shape.type === "circle" && (
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#4f6ef7" strokeWidth="2" />
            </svg>
          )}
          
          {shape.type === "curve" && (
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <path d="M 10 50 Q 50 10, 90 50" fill="none" stroke="#7c5cfc" strokeWidth="2" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
