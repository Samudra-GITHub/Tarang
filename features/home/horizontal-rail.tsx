"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function HorizontalRail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <h2 className="px-4 font-heading text-lg font-semibold tracking-tight md:px-6">{title}</h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </motion.section>
  );
}
