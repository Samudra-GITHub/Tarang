"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/lib/store/player-store";
import { announce } from "@/lib/store/announce-store";

/**
 * Mounted once in the app shell — announces play/pause and track changes to
 * screen readers regardless of which control (mini player, full player,
 * keyboard shortcut) triggered them. Skips the announcement on first mount
 * so loading the app doesn't narrate "Paused" before anyone has touched it.
 */
export function usePlayerAnnouncements() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const queue = usePlayerStore((s) => s.queue);
  const currentSong = currentIndex >= 0 ? queue[currentIndex] : undefined;

  const mountedTrack = useRef(false);
  const mountedPlaying = useRef(false);

  useEffect(() => {
    if (!mountedTrack.current) {
      mountedTrack.current = true;
      return;
    }
    if (currentSong) announce(`Now playing: ${currentSong.title} by ${currentSong.artistName}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  useEffect(() => {
    if (!mountedPlaying.current) {
      mountedPlaying.current = true;
      return;
    }
    if (currentSong) announce(isPlaying ? "Playing" : "Paused");
  }, [isPlaying, currentSong]);
}
