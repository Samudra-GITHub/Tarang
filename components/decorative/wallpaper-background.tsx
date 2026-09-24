"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const DOT_SPACING = 34;
const DOT_RADIUS = 1.1;
const DOT_COLOR = "45, 212, 191"; // --primary teal, matched to rgb() for per-dot alpha
const PARALLAX_MAX = 10;

/**
 * The full-bleed backdrop every floating glass surface sits on top of — a
 * dot-matrix particle field (retro-futurist, technical, meditative) instead
 * of the earlier aurora glow. Sparse teal dots on near-black, a slow
 * breathing pulse, and a faint pointer-reactive parallax drift. Rendered on
 * canvas so the sparse-dot depth fade stays cheap at any viewport size;
 * `prefers-reduced-motion` skips the animation loop entirely and paints one
 * static frame.
 */
export function WallpaperBackground() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: 0, y: 0 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.x = width / 2;
      pointer.y = height / 2;
    }

    function draw(time: number, driftX: number, driftY: number) {
      ctx!.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.hypot(cx, cy);
      const breath = reducedMotion ? 0 : Math.sin(time / 3200) * 0.18;

      for (let y = -DOT_SPACING; y < height + DOT_SPACING; y += DOT_SPACING) {
        for (let x = -DOT_SPACING; x < width + DOT_SPACING; x += DOT_SPACING) {
          const px = x + driftX;
          const py = y + driftY;
          const dist = Math.hypot(px - cx, py - cy) / maxDist;
          const depthFade = Math.max(0, 1 - dist * 1.05);
          const twinkle = reducedMotion
            ? 0
            : Math.sin(time / 2600 + x * 0.01 + y * 0.013) * 0.15;
          const alpha = Math.max(0, depthFade * 0.35 + breath * depthFade + twinkle * depthFade);
          if (alpha <= 0.01) continue;
          ctx!.beginPath();
          ctx!.arc(px, py, DOT_RADIUS, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${DOT_COLOR}, ${alpha.toFixed(3)})`;
          ctx!.fill();
        }
      }
    }

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      draw(0, 0, 0);
      return () => window.removeEventListener("resize", resize);
    }

    function handlePointerMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }
    window.addEventListener("pointermove", handlePointerMove);

    let raf = 0;
    function tick(time: number) {
      const driftX = ((pointer.x / width) * 2 - 1) * PARALLAX_MAX;
      const driftY = ((pointer.y / height) * 2 - 1) * PARALLAX_MAX;
      draw(time, driftX, driftY);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, #0d1412 0%, #090909 55%, #050505 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Scrim — guarantees floating glass panels stay legible over the field. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/55" />
    </div>
  );
}
