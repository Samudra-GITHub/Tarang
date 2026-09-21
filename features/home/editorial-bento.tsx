"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Playlist } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { getPlaylistSongs } from "@/lib/collections";
import { PlayButtonOverlay } from "@/components/cards/play-button-overlay";

export function EditorialBento({ playlists }: { playlists: Playlist[] }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const [featured, ...rest] = playlists;
  if (!featured) return null;

  return (
    <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg shadow-black/30 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/15"
      >
        <Link
          href={`/playlist/${featured.id}`}
          className="absolute inset-0"
          aria-label={featured.title}
        >
          <Image
            src={featured.coverUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 480px, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 pr-16 md:p-6 md:pr-20">
          <div className="min-w-0">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Featured
            </span>
            <h3 className="mt-1 truncate font-heading text-xl font-bold text-white md:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-0.5 truncate text-sm text-white/70">{featured.description}</p>
          </div>
        </div>
        <PlayButtonOverlay
          label={`Play ${featured.title}`}
          onPlay={() => playQueue(getPlaylistSongs(featured), 0, featured.title)}
        />
      </motion.div>

      {rest.slice(0, 4).map((playlist, index) => (
        <motion.div
          key={playlist.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.07 * (index + 1), ease: "easeOut" }}
          className="group relative aspect-square overflow-hidden rounded-xl shadow-lg shadow-black/30 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/15"
        >
          <Link
            href={`/playlist/${playlist.id}`}
            className="absolute inset-0"
            aria-label={playlist.title}
          >
            <Image
              src={playlist.coverUrl}
              alt=""
              fill
              sizes="200px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span className="absolute inset-x-0 bottom-0 truncate p-2.5 pr-11 text-sm font-semibold text-white">
            {playlist.title}
          </span>
          <PlayButtonOverlay
            label={`Play ${playlist.title}`}
            onPlay={() => playQueue(getPlaylistSongs(playlist), 0, playlist.title)}
          />
        </motion.div>
      ))}
    </div>
  );
}
