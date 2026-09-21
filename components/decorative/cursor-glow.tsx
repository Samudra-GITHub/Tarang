"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A soft light that trails the cursor within its container. Purely
 * decorative and desktop-only — clicks always pass through it.
 */
export function CursorGlow({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 120, damping: 25, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 25, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const handleMove = (event: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block",
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="absolute size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[90px]"
        style={{ left: springX, top: springY }}
      />
    </div>
  );
}
