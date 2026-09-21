"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pin, Play } from "lucide-react";
import type { Artist } from "@/types/music";
import { Button } from "@/components/ui/button";
import { getArtistSongs } from "@/lib/collections";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { usePinsStore } from "@/lib/store/pins-store";
import { BackdropArt } from "@/components/decorative/backdrop-art";

export function ArtistHeader({ artist }: { artist: Artist }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const followedArtistIds = useLibraryStore((state) => state.followedArtistIds);
  const toggleFollowedArtist = useLibraryStore((state) => state.toggleFollowedArtist);
  const pinned = usePinsStore((state) => state.isPinned("artist", artist.id));
  const togglePin = usePinsStore((state) => state.togglePin);

  const isFollowed = followedArtistIds.includes(artist.id);
  const allSongs = getArtistSongs(artist.id);

  return (
    <div className="relative isolate overflow-hidden pb-2">
      <BackdropArt src={artist.coverUrl} height="h-[320px] md:h-[380px]" />

      <div className="relative flex flex-col items-center gap-4 px-4 pt-12 text-center md:px-6 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative size-40 overflow-hidden rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.75)] ring-1 ring-white/10 md:size-48"
        >
          <Image src={artist.coverUrl} alt="" fill sizes="192px" className="object-cover" priority />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
        >
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Artist
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
            {artist.name}
          </h1>
          <p className="text-sm text-muted-foreground">{artist.genre}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <Button
            size="icon"
            className="size-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            onClick={() => playQueue(allSongs, 0, artist.name)}
            aria-label={`Play ${artist.name}`}
            disabled={allSongs.length === 0}
          >
            <Play className="size-5 fill-current" aria-hidden />
          </Button>
          <Button
            variant={isFollowed ? "secondary" : "outline"}
            className="rounded-full"
            onClick={() => toggleFollowedArtist(artist.id)}
            aria-pressed={isFollowed}
          >
            {isFollowed ? "Following" : "Follow"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => togglePin("artist", artist.id)}
            aria-label={pinned ? "Unpin" : "Pin to Home & Library"}
            aria-pressed={pinned}
          >
            <Pin className={cn("size-5", pinned && "fill-current text-primary")} aria-hidden />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
