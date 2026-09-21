"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  CornerDownRight,
  Download,
  Heart,
  Info,
  ListMusic,
  ListPlus,
  MoreHorizontal,
  Pin,
  PinOff,
  Play,
} from "lucide-react";
import type { Song } from "@/types/music";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format-time";
import { isYoutubeAudioUrl } from "@/features/youtube/youtube-engine";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { useDownloadsStore } from "@/lib/store/downloads-store";
import { usePlaylistPickerStore } from "@/lib/store/playlist-picker-store";
import { usePinsStore } from "@/lib/store/pins-store";
import { useCreditsUIStore } from "@/lib/store/credits-ui-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HighlightText } from "@/components/ui/highlight-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlayingIndicator } from "./playing-indicator";

export function TrackRow({
  song,
  index,
  showAlbum = false,
  onPlay,
  highlightQuery,
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  song: Song;
  index: number;
  showAlbum?: boolean;
  onPlay: () => void;
  highlightQuery?: string;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  const currentSongId = usePlayerStore((s) => s.queue[s.currentIndex]?.id);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const addNext = usePlayerStore((s) => s.addNext);
  const addToEnd = usePlayerStore((s) => s.addToEnd);
  const addToPlayLater = usePlayerStore((s) => s.addToPlayLater);

  const liked = useLibraryStore((s) => s.likedSongIds.includes(song.id));
  const toggleLikedSong = useLibraryStore((s) => s.toggleLikedSong);

  const downloaded = useDownloadsStore((s) => s.downloadedSongIds.includes(song.id));
  const toggleDownloaded = useDownloadsStore((s) => s.toggleDownloaded);

  const pinned = usePinsStore((s) => s.isPinned("song", song.id));
  const togglePin = usePinsStore((s) => s.togglePin);

  const openPlaylistPicker = usePlaylistPickerStore((s) => s.open);
  const openCredits = useCreditsUIStore((s) => s.open);

  const isCurrent = currentSongId === song.id;
  const handleActivate = selectable ? onToggleSelect ?? onPlay : onPlay;
  // Search-result songs are synthesized on the fly and have no real artist/album page to link to.
  const hasRealPages = !isYoutubeAudioUrl(song.audioUrl);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleActivate?.();
        }
      }}
      className="group grid cursor-pointer grid-cols-[24px_1fr_auto_auto_auto] items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-2 md:grid-cols-[24px_1fr_1fr_auto_auto_auto]"
    >
      <div className="flex items-center justify-center">
        {selectable ? (
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect?.()}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Select ${song.title}`}
          />
        ) : isCurrent && isPlaying ? (
          <PlayingIndicator />
        ) : (
          <>
            <span className="text-sm text-muted-foreground group-hover:hidden">{index}</span>
            <Play
              className="hidden size-3.5 fill-current text-foreground group-hover:block"
              aria-hidden
            />
          </>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={song.coverUrl}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded object-cover"
        />
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-medium",
              isCurrent ? "text-primary" : "text-foreground",
            )}
          >
            {highlightQuery ? (
              <HighlightText text={song.title} query={highlightQuery} />
            ) : (
              song.title
            )}
          </p>
          {hasRealPages ? (
            <Link
              href={`/artist/${song.artistId}`}
              onClick={(event) => event.stopPropagation()}
              className="block truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              {highlightQuery ? (
                <HighlightText text={song.artistName} query={highlightQuery} />
              ) : (
                song.artistName
              )}
            </Link>
          ) : (
            <p className="block truncate text-xs text-muted-foreground">{song.artistName}</p>
          )}
        </div>
      </div>

      {showAlbum &&
        (hasRealPages ? (
          <Link
            href={`/album/${song.albumId}`}
            onClick={(event) => event.stopPropagation()}
            className="hidden truncate text-sm text-muted-foreground hover:text-foreground hover:underline md:block"
          >
            {highlightQuery ? (
              <HighlightText text={song.albumTitle} query={highlightQuery} />
            ) : (
              song.albumTitle
            )}
          </Link>
        ) : (
          <p className="hidden truncate text-sm text-muted-foreground md:block">
            {song.albumTitle}
          </p>
        ))}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          toggleLikedSong(song.id);
        }}
        className="text-muted-foreground hover:text-foreground"
        aria-label={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
        aria-pressed={liked}
      >
        <Heart className={cn("size-4", liked && "fill-current text-accent-secondary")} aria-hidden />
      </button>

      <div className="flex items-center gap-3" onClick={(event) => event.stopPropagation()}>
        <span className="font-mono text-xs text-muted-foreground">
          {formatDuration(song.duration)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 rounded-full text-muted-foreground hover:text-foreground"
              aria-label={`More options for ${song.title}`}
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => addNext(song)}>
              <CornerDownRight className="size-4" aria-hidden />
              Play Next
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => addToEnd(song)}>
              <ListPlus className="size-4" aria-hidden />
              Add to Queue
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => addToPlayLater(song)}>
              <Clock className="size-4" aria-hidden />
              Play Later
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openPlaylistPicker(song.id)}>
              <ListMusic className="size-4" aria-hidden />
              Add to Playlist
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => togglePin("song", song.id)}>
              {pinned ? <PinOff className="size-4" aria-hidden /> : <Pin className="size-4" aria-hidden />}
              {pinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toggleDownloaded(song.id)}>
              <Download className={cn("size-4", downloaded && "text-primary")} aria-hidden />
              {downloaded ? "Remove Download" : "Download"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openCredits(song)}>
              <Info className="size-4" aria-hidden />
              Credits
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
