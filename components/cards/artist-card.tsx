"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, UserCheck } from "lucide-react";
import type { Artist } from "@/types/music";
import { Card } from "@/components/ui/card";
import { Body, Caption } from "@/components/ui/typography";
import { PlayButton } from "@/components/ui/play-button";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { getArtistSongs } from "@/lib/collections";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { cn } from "@/lib/utils";

export function ArtistCard({ artist }: { artist: Artist }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const currentArtistId = usePlayerStore((state) => {
    const song = state.currentIndex >= 0 ? state.queue[state.currentIndex] : undefined;
    return song?.artistId;
  });
  const isFollowing = useLibraryStore((state) => state.followedArtistIds.includes(artist.id));
  const toggleFollowedArtist = useLibraryStore((state) => state.toggleFollowedArtist);
  const glow = useDominantColor(artist.coverUrl);
  const isActive = currentArtistId === artist.id;

  return (
    <Card width="sm" tiltDegrees={6} className="text-center">
      <div className="relative mx-auto w-28 sm:w-32" style={{ "--card-glow": glow } as CSSProperties}>
        <div
          className={cn(
            "absolute -inset-1.5 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70",
            isActive && "opacity-70",
          )}
          style={{ background: `radial-gradient(circle, var(--card-glow) 0%, transparent 70%)` }}
          aria-hidden
        />
        <Link
          href={`/artist/${artist.id}`}
          className="relative block aspect-square overflow-hidden rounded-full border border-border bg-surface-2 shadow-md shadow-black/20 transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-ring group-hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.5),0_0_24px_-4px_var(--card-glow)]"
          aria-label={artist.name}
        >
          <Image
            src={artist.coverUrl}
            alt=""
            fill
            sizes="128px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
        </Link>

        <PlayButton
          label={`Play ${artist.name}`}
          size="sm"
          onPlay={() => playQueue(getArtistSongs(artist.id), 0, artist.name)}
        />

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleFollowedArtist(artist.id);
          }}
          aria-pressed={isFollowing}
          aria-label={isFollowing ? `Unfollow ${artist.name}` : `Follow ${artist.name}`}
          className={cn(
            "absolute top-1 left-1 flex size-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100",
            isFollowing && "text-primary opacity-100",
          )}
        >
          {isFollowing ? <UserCheck className="size-3.5" aria-hidden /> : <UserPlus className="size-3.5" aria-hidden />}
        </button>
      </div>

      <Link href={`/artist/${artist.id}`} className="focus-visible:outline-2 focus-visible:outline-ring">
        <Body className="mt-2 truncate font-medium group-hover:underline">{artist.name}</Body>
        <Caption className="block truncate">{artist.genre}</Caption>
      </Link>
    </Card>
  );
}
