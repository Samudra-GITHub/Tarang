"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useTrending } from "@/features/youtube/use-trending";
import { youtubeResultToSong } from "@/features/youtube/to-song";
import { Spinner } from "@/components/ui/spinner";
import { TrendingSongCard } from "@/components/cards/trending-song-card";
import { HorizontalRail } from "@/components/layout/horizontal-rail";

/** A live "what's trending right now" rail — reflows with a smooth shift whenever the feed updates. */
export function TrendingRail() {
  const { results, loading } = useTrending();
  const songs = useMemo(() => results.map(youtubeResultToSong), [results]);

  if (!loading && songs.length === 0) return null;

  return (
    <HorizontalRail
      title={
        <>
          <Flame className="size-5 text-accent-secondary" aria-hidden />
          Trending Now
        </>
      }
    >
      {loading ? (
        <div className="flex h-44 w-full items-center justify-center sm:h-48">
          <Spinner className="size-6" />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {songs.map((song) => (
            <TrendingSongCard key={song.id} song={song} />
          ))}
        </AnimatePresence>
      )}
    </HorizontalRail>
  );
}
