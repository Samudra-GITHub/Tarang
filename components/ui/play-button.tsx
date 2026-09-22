"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface PlayButtonProps {
  label: string;
  onPlay: () => void;
  /** "overlay" floats bottom-right on hover/focus of a `group` ancestor (cards). "inline" sits in normal flow, always visible (hero/collection headers). */
  variant?: "overlay" | "inline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "size-9",
  md: "size-10",
  lg: "size-14",
} as const;

const ICON_SIZE_CLASSES = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

/** The circular primary play control — floats on card artwork or sits inline on headers. */
function PlayButton({ label, onPlay, variant = "overlay", size = "md", className }: PlayButtonProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPlay();
      }}
      whileHover={reducedMotion ? undefined : { scale: 1.06 }}
      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
      transition={easings.springSnappy}
      className={cn(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity duration-200",
        SIZE_CLASSES[size],
        variant === "overlay" &&
          "absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100",
        className,
      )}
    >
      <Play className={cn(ICON_SIZE_CLASSES[size], "fill-current")} aria-hidden />
    </motion.button>
  );
}

export { PlayButton };
