"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Album } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { getAlbumSongs } from "@/lib/collections";
import { PlayButton } from "@/components/ui/play-button";
import { Heading, Body, Label } from "@/components/ui/typography";
import { durations, easings } from "@/lib/motion";

/** Asymmetrical magazine layout — one featured release, four supporting, different sizes. */
export function NewReleasesBento({ albums }: { albums: Album[] }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const [featured, ...rest] = albums;
  if (!featured) return null;

  return (
    <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: durations.slow, ease: easings.decelerate }}
        className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl border border-border shadow-lg shadow-black/30 transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/50"
      >
        <Link href={`/album/${featured.id}`} className="absolute inset-0" aria-label={featured.title}>
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
            <Label className="text-primary tracking-[0.2em]">New Release</Label>
            <Heading as="span" className="mt-1 block truncate text-white">
              {featured.title}
            </Heading>
            <Body className="mt-0.5 truncate text-white/70">
              {featured.artistName} · {featured.year}
            </Body>
          </div>
        </div>
        <PlayButton
          label={`Play ${featured.title}`}
          onPlay={() => playQueue(getAlbumSongs(featured), 0, featured.title)}
        />
      </motion.div>

      {rest.slice(0, 4).map((album, index) => (
        <motion.div
          key={album.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: durations.slow, delay: 0.07 * (index + 1), ease: easings.decelerate }}
          className="group relative aspect-square overflow-hidden rounded-xl border border-border shadow-lg shadow-black/30 transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/50"
        >
          <Link href={`/album/${album.id}`} className="absolute inset-0" aria-label={album.title}>
            <Image
              src={album.coverUrl}
              alt=""
              fill
              sizes="200px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 truncate p-2.5 pr-11">
            <p className="truncate font-semibold text-white">{album.title}</p>
            <p className="truncate text-xs text-white/65">{album.artistName}</p>
          </div>
          <PlayButton
            label={`Play ${album.title}`}
            onPlay={() => playQueue(getAlbumSongs(album), 0, album.title)}
          />
        </motion.div>
      ))}
    </div>
  );
}
