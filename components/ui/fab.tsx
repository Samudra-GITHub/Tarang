"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface FABProps
  extends Omit<React.ComponentProps<typeof motion.button>, "children"> {
  /** Required — a FAB is icon-only. */
  "aria-label": string;
  icon: React.ReactNode;
}

/**
 * A fixed-position circular Floating Action Button — reserved for a single
 * primary, page-level action (e.g. "compose", "scroll to top").
 */
const FAB = React.forwardRef<HTMLButtonElement, FABProps>(function FAB(
  { icon, className, ...props },
  ref,
) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.button
      ref={ref}
      type="button"
      whileHover={reducedMotion ? undefined : { scale: 1.05 }}
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
      transition={easings.springSnappy}
      className={cn(
        "fixed z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-6",
        className,
      )}
      {...props}
    >
      {icon}
    </motion.button>
  );
});

export { FAB };
