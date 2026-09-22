"use client";

import { Children, type ReactNode } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/layout/section";
import { railContainer, railItem } from "@/lib/motion-variants";
import { useMotionVariant } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface HorizontalRailProps {
  title: ReactNode;
  /** Fades/slides in once scrolled into view, staggering each item. Off for rails inside an already-animated context (e.g. a dialog). */
  animate?: boolean;
  /** Applies the rail's own `px-4 md:px-6` gutter — off when it already sits inside a PageContainer. */
  padded?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * The one horizontally-scrolling card row in Tarang — Trending, Recently Added,
 * Recommended, Artists, Albums and Playlists all render through this component.
 */
function HorizontalRail({ title, animate = true, padded = true, className, children }: HorizontalRailProps) {
  const containerVariants = useMotionVariant(railContainer);
  const itemVariants = useMotionVariant(railItem);

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <SectionTitle className={cn("flex items-center gap-2", padded && "px-4 md:px-6")}>
        {title}
      </SectionTitle>
      <motion.div
        initial={animate ? "initial" : undefined}
        whileInView={animate ? "animate" : undefined}
        viewport={animate ? { once: true, margin: "-80px" } : undefined}
        variants={animate ? containerVariants : undefined}
        className={cn(
          "flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          padded && "px-4 md:px-6",
        )}
      >
        {animate
          ? Children.map(children, (child) => (
              <motion.div variants={itemVariants} className="shrink-0">
                {child}
              </motion.div>
            ))
          : children}
      </motion.div>
    </section>
  );
}

export { HorizontalRail };
