"use client";

import { Flame } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTrending } from "@/features/youtube/use-trending";
import { youtubeResultToSong } from "@/features/youtube/to-song";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingSongCard } from "@/components/cards/trending-song-card";

function RailCardSkeleton() {
  return (
    <div className="w-40 shrink-0 sm:w-44">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="mt-2.5 h-4 w-3/4" />
      <Skeleton className="mt-1.5 h-3 w-1/2" />
    </div>
  );
}

/** A live "what's trending right now" rail — reflows with a smooth shift whenever the feed updates. */
export function TrendingRail() {
  const { results, loading } = useTrending();
  const songs = results.map(youtubeResultToSong);

  if (!loading && songs.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <h2 className="flex items-center gap-2 px-4 font-heading text-lg font-semibold tracking-tight md:px-6">
        <Flame className="size-5 text-accent-secondary" aria-hidden />
        Trending Now
      </h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <RailCardSkeleton key={i} />)
          : (
              <AnimatePresence mode="popLayout">
                {songs.map((song) => (
                  <TrendingSongCard key={song.id} song={song} />
                ))}
              </AnimatePresence>
            )}
      </div>
    </motion.section>
  );
}
