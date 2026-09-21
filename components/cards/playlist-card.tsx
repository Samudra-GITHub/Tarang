"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Playlist } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { getPlaylistSongs } from "@/lib/collections";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { useTilt } from "@/hooks/use-tilt";
import { springSnappy } from "@/lib/motion";
import { PlayButtonOverlay } from "./play-button-overlay";
import { CardProgress } from "./card-progress";

export function PlaylistCard({ playlist, progress }: { playlist: Playlist; progress?: number }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const glow = useDominantColor(playlist.coverUrl);
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  const glowVars = {
    "--glow-rest": `color-mix(in srgb, ${glow} 12%, transparent)`,
    "--glow-hover": `color-mix(in srgb, ${glow} 45%, transparent)`,
  } as CSSProperties;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group w-40 shrink-0 sm:w-44"
    >
      <div
        style={glowVars}
        className="relative aspect-square overflow-hidden rounded-xl bg-surface-2 shadow-[0_15px_35px_-12px_var(--glow-rest)] transition-shadow duration-300 group-hover:shadow-[0_25px_55px_-12px_var(--glow-hover)]"
      >
        <Link
          href={`/playlist/${playlist.id}`}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={playlist.title}
        >
          <Image
            src={playlist.coverUrl}
            alt=""
            fill
            sizes="176px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        </Link>
        <PlayButtonOverlay
          label={`Play ${playlist.title}`}
          onPlay={() => playQueue(getPlaylistSongs(playlist), 0, playlist.title)}
        />
        {progress !== undefined && <CardProgress value={progress} />}
      </div>
      <div className="mt-2.5 min-w-0">
        <Link
          href={`/playlist/${playlist.id}`}
          className="block truncate text-sm font-medium text-foreground hover:underline"
        >
          {playlist.title}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{playlist.description}</p>
      </div>
    </motion.div>
  );
}
