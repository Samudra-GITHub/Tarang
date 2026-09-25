"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarContent } from "@/components/layout/sidebar-content";
import { GLASS_PANEL } from "@/lib/glass";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Collapses to a 76px icon rail, expands to 240px with labels on hover. */
export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <motion.aside
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      animate={{ width: expanded ? 240 : 76 }}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
      className={cn("m-3 hidden shrink-0 overflow-hidden md:flex", GLASS_PANEL)}
      aria-label="Main navigation"
    >
      <SidebarContent expanded={expanded} />
    </motion.aside>
  );
}
