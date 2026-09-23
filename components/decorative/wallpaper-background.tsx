"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The full-screen immersive wallpaper every floating glass surface sits on
 * top of — an abstract aurora in Tarang's own teal/graphite palette (no
 * purple, no neon, no rainbow). Fixed behind the whole app shell; a dark
 * scrim keeps text legible over it regardless of where the glow drifts.
 */
export function WallpaperBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background" aria-hidden>
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="wallpaper-teal" cx="30%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#134e4a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#090909" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wallpaper-graphite" cx="75%" cy="65%" r="55%">
            <stop offset="0%" stopColor="#1f2937" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#090909" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wallpaper-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1412" />
            <stop offset="55%" stopColor="#090909" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#wallpaper-base)" />
        <motion.rect
          width="1600"
          height="900"
          fill="url(#wallpaper-teal)"
          animate={reducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect
          width="1600"
          height="900"
          fill="url(#wallpaper-graphite)"
          animate={reducedMotion ? undefined : { opacity: [0.9, 0.6, 0.9] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </svg>
      {/* Scrim — guarantees floating glass panels stay legible over any part of the wallpaper. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/60" />
    </div>
  );
}
