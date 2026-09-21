"use client";

import { Play, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaylistCard } from "@/components/cards/playlist-card";
import { TrackList } from "@/components/tracks/track-list";
import { WaveDivider } from "@/components/decorative/wave-divider";
import type { Mood } from "@/data/moods";
import { getMoodCoverUrl, getMoodMix, getMoodPlaylists } from "@/lib/collections";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { usePlayerStore } from "@/lib/store/player-store";
import { shuffleArray } from "@/lib/shuffle";
import { MoodEnvironmentBackground } from "./mood-environment";

export function MoodDetailView({ mood }: { mood: Mood }) {
  const color = useDominantColor(getMoodCoverUrl(mood));
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlists = getMoodPlaylists(mood);
  const mix = getMoodMix(mood);

  return (
    <div className="flex flex-col gap-10 pb-10">
      <section className="relative isolate overflow-hidden pb-8">
        <div className="relative h-[360px] md:h-[420px]">
          <MoodEnvironmentBackground environment={mood.environment} color={color} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 0%, var(--background) 92%)" }}
          />
          <div className="relative flex h-full flex-col items-center justify-end gap-3 px-4 pb-8 text-center md:px-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Mood Space
            </span>
            <h1 className="max-w-xl text-balance font-heading text-4xl font-bold tracking-tight md:text-6xl">
              {mood.name}
            </h1>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">{mood.description}</p>

            <div className="mt-3 flex items-center gap-3">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                onClick={() => playQueue(mix, 0, mood.name)}
                disabled={mix.length === 0}
              >
                <Play className="size-5 fill-current" aria-hidden />
                Play Mood Mix
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-12 rounded-full border border-border-strong text-muted-foreground hover:text-foreground"
                onClick={() => playQueue(shuffleArray(mix), 0, mood.name)}
                disabled={mix.length === 0}
                aria-label="Shuffle Mood Mix"
              >
                <Shuffle className="size-5" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
        <WaveDivider className="absolute inset-x-0 -bottom-1" />
      </section>

      {playlists.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="px-4 font-heading text-lg font-semibold tracking-tight md:px-6">
            Curated Playlists
          </h2>
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3 px-4 md:px-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Mood Mix</h2>
        <TrackList songs={mix} sourceLabel={mood.name} />
      </section>
    </div>
  );
}
