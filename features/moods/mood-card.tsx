"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Mood } from "@/data/moods";
import { getMoodCoverUrl } from "@/lib/collections";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { useTilt } from "@/hooks/use-tilt";
import { easings } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MoodEnvironmentBackground } from "./mood-environment";
import { Title, Caption } from "@/components/ui/typography";

export function MoodCard({ mood }: { mood: Mood }) {
  const glow = useDominantColor(getMoodCoverUrl(mood));
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      transition={easings.springSnappy}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      className="group w-44 shrink-0 sm:w-52"
      tabIndex={-1}
    >
      <Link
        href={`/moods/${mood.id}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl border border-border bg-surface-2 shadow-md shadow-black/20 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-black/35 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <MoodEnvironmentBackground environment={mood.environment} color={glow} className="-z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4">
          <Title className="text-white">{mood.name}</Title>
          <Caption className="line-clamp-1 text-white/70">{mood.tagline}</Caption>
        </div>
      </Link>
    </motion.div>
  );
}
