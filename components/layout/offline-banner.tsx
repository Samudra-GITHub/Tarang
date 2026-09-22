"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { durations, easings } from "@/lib/motion";

/** A slim, dismiss-free bar that appears app-wide the moment the browser goes offline. */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: durations.fast, ease: easings.decelerate }}
          className="overflow-hidden"
        >
          <div
            role="status"
            className="flex items-center justify-center gap-2 bg-accent-secondary/15 px-4 py-2 text-center text-xs font-medium text-accent-secondary"
          >
            <WifiOff className="size-3.5 shrink-0" aria-hidden />
            You&apos;re offline. Downloaded songs still play — search and streaming need a
            connection.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
