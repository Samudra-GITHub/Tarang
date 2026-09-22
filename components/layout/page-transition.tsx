"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { pageEnter } from "@/lib/motion-variants";
import { useMotionVariant } from "@/hooks/use-reduced-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const variants = useMotionVariant(pageEnter);

  // The scroll container (`<main>`) persists across route changes — reset it
  // to the top on every navigation instead of leaving the new page scrolled
  // to wherever the previous one was left.
  useEffect(() => {
    ref.current?.closest("main")?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <AnimatePresence initial={false}>
      <motion.div key={pathname} ref={ref} variants={variants} initial="initial" animate="animate" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
