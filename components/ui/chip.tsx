"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const chipVariants = cva(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      selected: {
        true: "bg-primary text-primary-foreground",
        false: "bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

export interface ChipProps
  extends Omit<React.ComponentProps<typeof motion.button>, "children">,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /** Renders a trailing "×" and makes the chip a dismissible tag rather than a toggle. */
  onRemove?: () => void;
  removeLabel?: string;
}

/**
 * The base pill underlying every filter/tag control in Tarang.
 * FilterChip, GenreChip, MoodChip, ArtistChip and TagChip are all this
 * component with a fitting default `aria-pressed` semantic layered on top.
 */
const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className, selected, icon, onRemove, removeLabel, children, onClick, ...props },
  ref,
) {
  const reducedMotion = useReducedMotion();

  if (onRemove) {
    return (
      <span
        className={cn(chipVariants({ selected: selected ?? true }), "pr-1.5", className)}
      >
        {icon}
        {children}
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : "filter"}`}
          className="relative rounded-full p-0.5 before:absolute before:-inset-3 before:content-[''] hover:bg-black/15"
        >
          <X className="size-3" aria-hidden />
        </button>
      </span>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={selected ?? undefined}
      whileTap={reducedMotion ? undefined : { scale: 0.94 }}
      transition={easings.springSnappy}
      className={cn(chipVariants({ selected }), className)}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
});

/** A single filter toggle — sort modes, quality tiers, visualizer styles. */
const FilterChip = Chip;

/** A genre pill — genre browse rows, tag lists on a track. */
const GenreChip = Chip;

/** A mood pill — mood tag lists alongside a track or playlist. */
const MoodChip = Chip;

/** An artist pill — featured-artist tag lists on a track or album. */
const ArtistChip = Chip;

/** A generic label pill — anywhere a piece of freeform metadata needs a tag shape, or a dismissible active-filter tag via `onRemove`. */
const TagChip = Chip;

export { Chip, FilterChip, GenreChip, MoodChip, ArtistChip, TagChip, chipVariants };
