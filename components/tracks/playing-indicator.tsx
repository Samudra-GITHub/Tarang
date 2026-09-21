"use client";

import { motion } from "framer-motion";

const bars = [0, 1, 2];

export function PlayingIndicator() {
  return (
    <div className="flex h-3 items-end gap-0.5" aria-hidden>
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-0.5 bg-primary"
          animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
