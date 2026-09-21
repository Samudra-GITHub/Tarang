"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Play } from "lucide-react";
import type { Album, Playlist } from "@/types/music";
import { Button } from "@/components/ui/button";
import { BackdropArt } from "@/components/decorative/backdrop-art";
import { WaveDivider } from "@/components/decorative/wave-divider";
import { CursorGlow } from "@/components/decorative/cursor-glow";
import { FloatingParticles } from "@/components/decorative/floating-particles";
import { WaveformAccent } from "@/components/decorative/waveform-accent";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { getAlbumSongs, getPlaylistSongs } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { springSmooth } from "@/lib/motion";

export type Spotlight = { kind: "album"; item: Album } | { kind: "playlist"; item: Playlist };

export function HeroSpotlight({ spotlight, greeting }: { spotlight: Spotlight; greeting: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const playQueue = usePlayerStore((state) => state.playQueue);
  const savedAlbumIds = useLibraryStore((state) => state.savedAlbumIds);
  const savedPlaylistIds = useLibraryStore((state) => state.savedPlaylistIds);
  const toggleSavedAlbum = useLibraryStore((state) => state.toggleSavedAlbum);
  const toggleSavedPlaylist = useLibraryStore((state) => state.toggleSavedPlaylist);

  const isAlbum = spotlight.kind === "album";
  const entity = spotlight.item;
  const songs = isAlbum
    ? getAlbumSongs(spotlight.item as Album)
    : getPlaylistSongs(spotlight.item as Playlist);
  const href = isAlbum ? `/album/${entity.id}` : `/playlist/${entity.id}`;
  const subtitle = isAlbum ? (entity as Album).artistName : (entity as Playlist).description;
  const isSaved = isAlbum ? savedAlbumIds.includes(entity.id) : savedPlaylistIds.includes(entity.id);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden pb-8 md:pb-12">
      <BackdropArt src={entity.coverUrl} height="h-[440px] md:h-[520px]" parallaxY={backdropY} />
      <FloatingParticles />
      <CursorGlow />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative flex flex-col items-center gap-6 px-4 pt-8 md:flex-row md:items-end md:gap-10 md:px-6 md:pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={springSmooth}
          whileHover={{ scale: 1.03 }}
          className="relative size-44 shrink-0 overflow-hidden rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)] ring-1 ring-white/10 sm:size-56 md:size-64"
        >
          <Image src={entity.coverUrl} alt="" fill sizes="256px" className="object-cover" priority />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
          className="flex flex-col items-center gap-2.5 text-center md:items-start md:pb-2 md:text-left"
        >
          <p className="text-sm font-medium text-muted-foreground">{greeting}</p>
          <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {isAlbum ? "Jump back in" : "Editorial Pick"}
          </span>
          <h1 className="max-w-xl text-balance font-heading text-4xl font-bold tracking-tight md:text-6xl">
            {entity.title}
          </h1>
          {subtitle && (
            <p className="max-w-md text-sm text-muted-foreground md:text-base">{subtitle}</p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <Button
              size="lg"
              className="h-12 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              onClick={() => playQueue(songs, 0, entity.title)}
              disabled={songs.length === 0}
            >
              <Play className="size-5 fill-current" aria-hidden />
              Play Now
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-12 rounded-full border border-border-strong text-muted-foreground hover:text-foreground"
              onClick={() =>
                isAlbum ? toggleSavedAlbum(entity.id) : toggleSavedPlaylist(entity.id)
              }
              aria-pressed={isSaved}
              aria-label={isSaved ? "Remove from Your Library" : "Save to Your Library"}
            >
              <Heart
                className={cn("size-5", isSaved && "fill-current text-accent-secondary")}
                aria-hidden
              />
            </Button>
            <Link
              href={href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              View {isAlbum ? "album" : "playlist"}
            </Link>
          </div>

          <WaveformAccent className="mt-4 w-40 opacity-40 md:w-48" />
        </motion.div>
      </motion.div>

      <WaveDivider className="absolute inset-x-0 -bottom-1" />
    </section>
  );
}
