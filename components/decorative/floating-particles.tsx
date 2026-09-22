"use client";

import { useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Particle {
  left: string;
  size: number;
  delay: string;
  duration: string;
  drift: string;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const rand = (seed % 1000) / 1000;
    return {
      left: `${(i / count) * 100 + rand * 6}%`,
      size: 2 + Math.round(rand * 3),
      delay: `${(i % 10) * -1.6}s`,
      duration: `${11 + (i % 6) * 2.2}s`,
      drift: `${(i % 2 === 0 ? 1 : -1) * (12 + (i % 5) * 6)}px`,
    };
  });
}

/** Slow-drifting ambient motes — desktop only, decorative, never blocks input. */
export function FloatingParticles({ className, count = 18 }: { className?: string; count?: number }) {
  const reduced = useReducedMotion();
  const particles = useMemo(() => generateParticles(count), [count]);

  if (reduced) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block", className)}
      aria-hidden
    >
      {particles.map((particle, index) => (
        <span
          key={index}
          data-tarang-particle
          className="absolute bottom-0 rounded-full bg-primary/40"
          style={
            {
              left: particle.left,
              width: particle.size,
              height: particle.size,
              animation: `tarang-float ${particle.duration} ease-in-out ${particle.delay} infinite`,
              "--drift": particle.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
