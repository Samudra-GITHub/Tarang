"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/lib/store/player-store";

/** App-wide media shortcuts: Space play/pause, N/P next/previous, M mute — inert while typing. */
export function useGlobalShortcuts() {
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const toggleMute = usePlayerStore((s) => s.toggleMute);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (isTyping) return;

      switch (event.key.toLowerCase()) {
        case " ":
          event.preventDefault();
          togglePlay();
          break;
        case "n":
          next();
          break;
        case "p":
          previous();
          break;
        case "m":
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, next, previous, toggleMute]);
}
