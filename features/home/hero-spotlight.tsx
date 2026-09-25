"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Play } from "lucide-react";
import type { Album, Playlist } from "@/types/music";
import { Button } from "@/components/ui/button";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { getAlbumSongs, getPlaylistSongs } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Display } from "@/components/ui/typography";
import { GLASS_PILL } from "@/lib/glass";

export type Spotlight = { kind: "album"; item: Album } | { kind: "playlist"; item: Playlist };

/**
 * Cinematic full-bleed spotlight — huge portrait artwork bleeding off the
 * right edge and dissolving into the background via layered gradients, an
 * ambient glow tinted from the artwork's own dominant color, and metadata
 * sitting directly on that field (no card, no hard rectangle).
 */
export function HeroSpotlight({ spotlight, greeting }: { spotlight: Spotlight; greeting: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
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
  const reducedMotion = useReducedMotion();
  const glow = useDominantColor(entity.coverUrl);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pb-10 md:flex md:min-h-[640px] md:items-center md:pb-16"
    >
      {/* Dynamic ambient light — tinted from this entity's own artwork, slow breathing */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <motion.div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `radial-gradient(60% 55% at 78% 38%, color-mix(in srgb, ${glow} 42%, transparent) 0%, transparent 70%)`,
          }}
          animate={reducedMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Portrait artwork — stacks on top on mobile, bleeds off the right edge on desktop */}
      <motion.div
        style={{ y: imageY }}
        className="relative h-[300px] w-full md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[55%]"
        aria-hidden
      >
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: durations.hero, ease: easings.decelerate }}
          className="relative size-full"
        >
          <Image
            src={entity.coverUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-0 md:opacity-100" />
        </motion.div>
      </motion.div>

      {/* Metadata — sits directly on the ambient field, no card, no border */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col gap-4 px-6 py-8 md:max-w-xl md:px-14 md:py-0"
      >
        <p className="text-sm font-medium text-muted-foreground">{greeting}</p>
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {isAlbum ? "Jump back in" : "Editorial Pick"}
        </span>
        <Display className="text-5xl leading-[0.95] md:text-7xl">{entity.title}</Display>
        {subtitle && <p className="max-w-md text-base text-muted-foreground">{subtitle}</p>}

        <div className="mt-2 flex items-center gap-3">
          <Button
            size="lg"
            className="h-12 gap-2 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            onClick={() => playQueue(songs, 0, entity.title)}
            disabled={songs.length === 0}
          >
            <Play className="size-5 fill-current" aria-hidden />
            Play Now
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-12 text-muted-foreground hover:text-foreground", GLASS_PILL)}
            onClick={() => (isAlbum ? toggleSavedAlbum(entity.id) : toggleSavedPlaylist(entity.id))}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Remove from Your Library" : "Save to Your Library"}
          >
            <Heart className={cn("size-5", isSaved && "fill-current text-accent-secondary")} aria-hidden />
          </Button>
          <Link
            href={href}
            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            View {isAlbum ? "album" : "playlist"}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
