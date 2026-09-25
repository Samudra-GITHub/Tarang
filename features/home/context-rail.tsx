"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListMusic, Music2 } from "lucide-react";
import { usePlayerStore } from "@/lib/store/player-store";
import { usePlayerUIStore } from "@/lib/store/player-ui-store";
import { useHistoryStore } from "@/lib/store/history-store";
import { getSongsForIds } from "@/lib/collections";
import { GLASS_PANEL } from "@/lib/glass";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format-time";
import { Caption } from "@/components/ui/typography";
import type { Song } from "@/types/music";

function Widget({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-3 p-4", GLASS_PANEL)}>
      <div className="flex items-center justify-between">
        <Caption className="font-semibold tracking-wide text-foreground uppercase">{title}</Caption>
        {action}
      </div>
      {children}
    </div>
  );
}

function SongRow({ song }: { song: Song }) {
  return (
    <Link
      href={`/album/${song.albumId}`}
      className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-white/[0.05]"
    >
      <Image
        src={song.coverUrl}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{song.title}</p>
        <p className="truncate text-xs text-muted-foreground">{song.artistName}</p>
      </div>
    </Link>
  );
}

/** Sticky right-hand widget column — Now Playing, Up Next, Recently Played. Desktop only. */
export function ContextRail() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const openQueue = usePlayerUIStore((s) => s.openQueue);
  const events = useHistoryStore((s) => s.events);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : undefined;
  const upNext = queue.slice(currentIndex + 1, currentIndex + 4);

  const recentlyPlayed = useMemo(() => {
    const seen = new Set<string>();
    const ids: string[] = [];
    for (let i = events.length - 1; i >= 0 && ids.length < 4; i--) {
      const id = events[i].songId;
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
    return getSongsForIds(ids);
  }, [events]);

  return (
    <div className="sticky top-4 hidden w-72 shrink-0 flex-col gap-4 self-start xl:flex">
      <Widget title="Now Playing">
        {currentSong ? (
          <div className="flex items-center gap-3">
            <Image
              src={currentSong.coverUrl}
              alt=""
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{currentSong.title}</p>
              <p className="truncate text-xs text-muted-foreground">{currentSong.artistName}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
              <Music2 className="size-5" aria-hidden />
            </div>
            <p className="text-sm">Nothing playing</p>
          </div>
        )}
      </Widget>

      {upNext.length > 0 && (
        <Widget
          title="Up Next"
          action={
            <button
              type="button"
              onClick={openQueue}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              aria-label="Open full queue"
            >
              <ListMusic className="size-3.5" aria-hidden />
              All
            </button>
          }
        >
          <div className="flex flex-col gap-0.5">
            {upNext.map((song, index) => (
              <SongRow key={`${song.id}-${index}`} song={song} />
            ))}
          </div>
        </Widget>
      )}

      {recentlyPlayed.length > 0 && (
        <Widget title="Recently Played">
          <div className="flex flex-col gap-0.5">
            {recentlyPlayed.map((song) => (
              <SongRow key={song.id} song={song} />
            ))}
          </div>
        </Widget>
      )}
    </div>
  );
}
