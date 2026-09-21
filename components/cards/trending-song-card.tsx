"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Song } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { useSongPopupStore } from "@/lib/store/song-popup-store";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { useTilt } from "@/hooks/use-tilt";
import { springSnappy } from "@/lib/motion";
import { PlayButtonOverlay } from "./play-button-overlay";

export function TrendingSongCard({ song }: { song: Song }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const openPopup = useSongPopupStore((state) => state.open);
  const glow = useDominantColor(song.coverUrl);
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  const glowVars = {
    "--glow-rest": `color-mix(in srgb, ${glow} 14%, transparent)`,
    "--glow-hover": `color-mix(in srgb, ${glow} 50%, transparent)`,
  } as CSSProperties;

  return (
    <motion.div
      layout
      layoutId={`trending-${song.id}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group w-40 shrink-0 sm:w-44"
    >
      <button
        type="button"
        onClick={() => openPopup(song)}
        style={glowVars}
        className="relative block aspect-square w-full overflow-hidden rounded-xl bg-surface-2 text-left shadow-[0_15px_35px_-12px_var(--glow-rest)] transition-shadow duration-300 group-hover:shadow-[0_25px_55px_-12px_var(--glow-hover)] focus-visible:outline-2 focus-visible:outline-ring"
        aria-label={`${song.title} by ${song.artistName} — open details`}
      >
        <Image
          src={song.coverUrl}
          alt=""
          fill
          sizes="176px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <PlayButtonOverlay
          label={`Play ${song.title}`}
          onPlay={() => playQueue([song], 0, song.title)}
        />
      </button>
      <div className="mt-2.5 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{song.title}</p>
        <p className="truncate text-xs text-muted-foreground">{song.artistName}</p>
      </div>
    </motion.div>
  );
}
