// ============================================================
// Particle Background — Antigravity physics like Google
// ============================================================

"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface MouseTrail {
  x: number;
  y: number;
  opacity: number;
  size: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<MouseTrail[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 2,
          opacity: Math.random() * 0.4 + 0.3,
          color: Math.random() > 0.5 ? "#4f6ef7" : "#ffffff",
        });
      }
    };
    initParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
      
      // Add to trail
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY + window.scrollY,
        opacity: 0.6,
        size: 8,
      });
      
      // Keep trail length at 15
      if (trailRef.current.length > 15) {
        trailRef.current.shift();
      }
    };

    // Click explosion
    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY + window.scrollY;
      
      particlesRef.current.forEach((particle) => {
        const dx = particle.x - clickX;
        const dy = particle.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200 * 15;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repel from cursor (antigravity)
        if (distance < 150) {
          const force = ((150 - distance) / 150) * 0.8;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        // Attract back to origin
        particle.vx += (particle.originX - particle.x) * 0.03;
        particle.vy += (particle.originY - particle.y) * 0.03;

        // Apply friction
        particle.vx *= 0.92;
        particle.vy *= 0.92;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.5;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.5;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      // Draw connections between nearby particles
      ctx.globalAlpha = 1;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(79, 110, 247, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw cursor trail
      trailRef.current.forEach((trail, index) => {
        const progress = index / trailRef.current.length;
        trail.opacity -= 0.04;
        trail.size -= 0.3;

        if (trail.opacity > 0 && trail.size > 0) {
          ctx.beginPath();
          ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
          ctx.fillStyle = "#4f6ef7";
          ctx.globalAlpha = trail.opacity * progress;
          ctx.fill();
        }
      });

      // Clean up old trail points
      trailRef.current = trailRef.current.filter(
        (trail) => trail.opacity > 0 && trail.size > 0
      );

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
