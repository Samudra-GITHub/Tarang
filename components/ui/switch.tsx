"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** A binary on/off control — settings toggles, per-item preference switches. */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onCheckedChange, disabled, className, ...props },
  ref,
) {
  const reducedMotion = useReducedMotion();
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40",
        checked ? "bg-primary" : "bg-surface-3",
        className,
      )}
      {...props}
    >
      <motion.span
        animate={{ x: checked ? 16 : 0 }}
        transition={reducedMotion ? { duration: 0 } : easings.springSnappy}
        className="size-4 rounded-full bg-white"
      />
    </button>
  );
});

export { Switch };
