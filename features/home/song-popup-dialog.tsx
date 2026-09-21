"use client";

import Image from "next/image";
import { Heart, ListMusic, Pin, PinOff, Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format-time";
import { useSongPopupStore } from "@/lib/store/song-popup-store";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { usePinsStore } from "@/lib/store/pins-store";
import { usePlaylistPickerStore } from "@/lib/store/playlist-picker-store";

/** A quick-look popup for a song card — play, like, pin, or queue without leaving the page. */
export function SongPopupDialog() {
  const song = useSongPopupStore((s) => s.song);
  const close = useSongPopupStore((s) => s.close);

  const playQueue = usePlayerStore((s) => s.playQueue);
  const liked = useLibraryStore((s) => (song ? s.likedSongIds.includes(song.id) : false));
  const toggleLikedSong = useLibraryStore((s) => s.toggleLikedSong);
  const pinned = usePinsStore((s) => (song ? s.isPinned("song", song.id) : false));
  const togglePin = usePinsStore((s) => s.togglePin);
  const openPlaylistPicker = usePlaylistPickerStore((s) => s.open);

  return (
    <Dialog open={Boolean(song)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-xs">
        {song && (
          <div className="flex min-w-0 flex-col items-center gap-4 pt-2 text-center">
            <div className="relative size-40 shrink-0 overflow-hidden rounded-xl shadow-[0_20px_45px_-12px_rgba(0,0,0,0.7)]">
              <Image src={song.coverUrl} alt="" fill sizes="160px" className="object-cover" />
            </div>
            <div className="min-w-0 w-full">
              <p className="truncate font-heading text-lg font-bold tracking-tight">
                {song.title}
              </p>
              <p className="truncate text-sm text-muted-foreground">{song.artistName}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {formatDuration(song.duration)}
              </p>
            </div>

            <Button
              className="h-11 w-full gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                playQueue([song], 0, song.title);
                close();
              }}
            >
              <Play className="size-4 fill-current" aria-hidden />
              Play
            </Button>

            <div className="flex w-full items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => toggleLikedSong(song.id)}
                aria-label={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
                aria-pressed={liked}
              >
                <Heart className={cn("size-5", liked && "fill-current text-accent-secondary")} aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => openPlaylistPicker(song.id)}
                aria-label="Add to Playlist"
              >
                <ListMusic className="size-5" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => togglePin("song", song.id)}
                aria-label={pinned ? "Unpin" : "Pin"}
                aria-pressed={pinned}
              >
                {pinned ? (
                  <PinOff className="size-5 fill-current text-primary" aria-hidden />
                ) : (
                  <Pin className="size-5" aria-hidden />
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
