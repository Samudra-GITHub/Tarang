"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Song } from "@/types/music";
import { isYoutubeAudioUrl } from "@/features/youtube/youtube-engine";
import { PlayButtonOverlay } from "./play-button-overlay";

export function SongPinCard({ song, onPlay }: { song: Song; onPlay: () => void }) {
  const hasRealPages = !isYoutubeAudioUrl(song.audioUrl);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group w-40 shrink-0 sm:w-44"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-2 shadow-lg shadow-black/30">
        {hasRealPages ? (
          <Link
            href={`/album/${song.albumId}`}
            className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-ring"
            aria-label={`${song.title} by ${song.artistName}`}
          >
            <Image
              src={song.coverUrl}
              alt=""
              fill
              sizes="176px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-ring"
            aria-label={`Play ${song.title} by ${song.artistName}`}
          >
            <Image
              src={song.coverUrl}
              alt=""
              fill
              sizes="176px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        )}
        <PlayButtonOverlay label={`Play ${song.title}`} onPlay={onPlay} />
        <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
          Song
        </span>
      </div>
      <div className="mt-2.5 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{song.title}</p>
        {hasRealPages ? (
          <Link
            href={`/artist/${song.artistId}`}
            className="block truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            {song.artistName}
          </Link>
        ) : (
          <p className="block truncate text-xs text-muted-foreground">{song.artistName}</p>
        )}
      </div>
    </motion.div>
  );
}
