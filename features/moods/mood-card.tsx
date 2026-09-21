"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Mood } from "@/data/moods";
import { getMoodCoverUrl } from "@/lib/collections";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { useTilt } from "@/hooks/use-tilt";
import { springSnappy } from "@/lib/motion";
import { MoodEnvironmentBackground } from "./mood-environment";

export function MoodCard({ mood }: { mood: Mood }) {
  const glow = useDominantColor(getMoodCoverUrl(mood));
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  const glowVars = {
    "--glow-rest": `color-mix(in srgb, ${glow} 14%, transparent)`,
    "--glow-hover": `color-mix(in srgb, ${glow} 50%, transparent)`,
  } as CSSProperties;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group w-44 shrink-0 sm:w-52"
    >
      <Link
        href={`/moods/${mood.id}`}
        style={glowVars}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-surface-2 shadow-[0_15px_35px_-12px_var(--glow-rest)] transition-shadow duration-300 group-hover:shadow-[0_25px_55px_-12px_var(--glow-hover)] focus-visible:outline-2 focus-visible:outline-ring"
      >
        <MoodEnvironmentBackground environment={mood.environment} color={glow} className="-z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4">
          <h3 className="font-heading text-lg font-bold tracking-tight text-white">{mood.name}</h3>
          <p className="line-clamp-1 text-xs text-white/70">{mood.tagline}</p>
        </div>
      </Link>
    </motion.div>
  );
}
