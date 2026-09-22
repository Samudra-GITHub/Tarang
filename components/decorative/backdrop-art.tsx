"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { durations, easings } from "@/lib/motion";

/**
 * A full-bleed, blurred album-art backdrop that fades into the page background.
 * The "dynamic background derived from album colors" effect, reused across the
 * Home hero, collection headers, and the full-screen player.
 */
export function BackdropArt({
  src,
  className,
  height = "h-[380px]",
  parallaxY,
}: {
  src: string;
  className?: string;
  height?: string;
  /** Optional scroll-linked motion value for a parallax drift. */
  parallaxY?: MotionValue<number>;
}) {
  const tint = useDominantColor(src);

  return (
    <motion.div
      className={cn("pointer-events-none absolute inset-x-0 top-0 -z-10", height, className)}
      style={parallaxY ? { y: parallaxY } : undefined}
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1.08 }}
        transition={{ duration: durations.hero, ease: easings.decelerate }}
        className="absolute inset-0 overflow-hidden"
      >
        <Image src={src} alt="" fill sizes="100vw" className="object-cover blur-3xl" priority />
      </motion.div>
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${tint} 50%, transparent) 0%, color-mix(in srgb, ${tint} 15%, transparent) 45%, var(--background) 96%)`,
        }}
      />
      <div className="absolute inset-0 bg-background/35" />
    </motion.div>
  );
}
