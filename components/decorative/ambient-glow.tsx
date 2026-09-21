"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Soft, slow-breathing teal/coral blooms — brand-colored ambient texture, never a rainbow. */
export function AmbientGlow({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden>
      <motion.div
        className="absolute -top-24 left-[10%] size-[380px] rounded-full bg-primary/15 blur-[110px]"
        animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 right-[8%] size-[320px] rounded-full bg-accent-secondary/10 blur-[110px]"
        animate={reduced ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
    </div>
  );
}
