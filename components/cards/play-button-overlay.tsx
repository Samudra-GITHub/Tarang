"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

export function PlayButtonOverlay({
  onPlay,
  label,
}: {
  onPlay: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPlay();
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="absolute right-2 bottom-2 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
    >
      <Play className="size-4 fill-current" aria-hidden />
    </motion.button>
  );
}
