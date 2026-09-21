"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** A wave-shaped edge — Tarang's identity motif — closing out hero sections. */
export function WaveDivider({
  className,
  color = "var(--background)",
}: {
  className?: string;
  color?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={cn("pointer-events-none block h-12 w-full md:h-20", className)}
      aria-hidden
    >
      <motion.path
        d="M0,40 C180,90 360,0 540,30 C720,60 900,100 1080,70 C1260,40 1350,50 1440,45 L1440,100 L0,100 Z"
        fill={color}
        initial={{ opacity: 0.85 }}
        animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
