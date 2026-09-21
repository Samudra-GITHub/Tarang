"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const BARS = Array.from({ length: 28 });

/** A purely decorative, ever-animating equalizer flourish — Tarang's wave motif. */
export function WaveformAccent({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("flex h-8 items-end gap-[3px]", className)} aria-hidden>
      {BARS.map((_, index) => {
        const peak = 30 + ((index * 37) % 65);
        return (
          <motion.span
            key={index}
            className="w-[3px] rounded-full bg-primary"
            initial={{ height: "20%" }}
            animate={reduced ? undefined : { height: ["20%", `${peak}%`, "20%"] }}
            transition={{
              duration: 1.3 + (index % 5) * 0.18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.045,
            }}
          />
        );
      })}
    </div>
  );
}
