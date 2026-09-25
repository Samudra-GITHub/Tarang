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
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { easings } from "@/lib/motion";
import { formatTotalDuration } from "@/lib/format-time";
import { PlayButton } from "@/components/ui/play-button";
import { GLASS_PILL } from "@/lib/glass";
import { cn } from "@/lib/utils";

/** A wide, cinematic playlist card — cover bleeds edge to edge, gradient overlay, real song count/duration, glass play button. */
export function PlaylistCinematicCard({ playlist }: { playlist: Playlist }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const songs = getPlaylistSongs(playlist);
  const totalSeconds = songs.reduce((sum, song) => sum + song.duration, 0);
  const glow = useDominantColor(playlist.coverUrl);
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(5);
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ "--card-glow": glow } as CSSProperties}
      className="group relative w-72 shrink-0 sm:w-80"
    >
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={easings.springSnappy}
        style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] shadow-lg shadow-black/30 transition-shadow duration-300 group-hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.55),0_0_30px_-6px_var(--card-glow)]"
      >
        <Link href={`/playlist/${playlist.id}`} className="absolute inset-0" aria-label={playlist.title}>
          <Image
            src={playlist.coverUrl}
            alt=""
            fill
            sizes="320px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{playlist.title}</p>
            <p className="mt-0.5 truncate text-xs text-white/65">
              {songs.length} songs · {formatTotalDuration(totalSeconds)}
            </p>
          </div>
        </div>

        <PlayButton
          label={`Play ${playlist.title}`}
          onPlay={() => playQueue(songs, 0, playlist.title)}
          className={cn("border border-white/[0.1] bg-transparent text-white", GLASS_PILL)}
        />
      </motion.div>
    </div>
  );
}
