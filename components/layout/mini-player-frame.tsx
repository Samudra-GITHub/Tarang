"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ListMusic,
  Music2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Icon } from "@/components/ui/icon";
import { PlaybackProgress } from "@/components/ui/playback-progress";
import { VolumeProgress } from "@/components/ui/volume-progress";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { usePlayerUIStore } from "@/lib/store/player-ui-store";
import { isYoutubeAudioUrl } from "@/features/youtube/youtube-engine";
import { Body, Caption } from "@/components/ui/typography";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { announce } from "@/lib/store/announce-store";
import { formatDuration } from "@/lib/format-time";

export function MiniPlayerFrame() {
  const reducedMotion = useReducedMotion();
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeatMode = usePlayerStore((s) => s.cycleRepeatMode);

  const likedSongIds = useLibraryStore((s) => s.likedSongIds);
  const toggleLikedSong = useLibraryStore((s) => s.toggleLikedSong);

  const openNowPlaying = usePlayerUIStore((s) => s.openNowPlaying);
  const openQueue = usePlayerUIStore((s) => s.openQueue);

  const [seekPreview, setSeekPreview] = useState<number | null>(null);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : undefined;
  const hasTrack = Boolean(currentSong);
  const liked = currentSong ? likedSongIds.includes(currentSong.id) : false;
  const displayedTime = seekPreview ?? currentTime;
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  return (
    <div
      role="region"
      aria-label="Now playing"
      className="mx-2 mb-2 flex h-player shrink-0 items-center gap-4 rounded-2xl border border-border-strong/60 bg-surface-player px-3 shadow-lg shadow-black/40 md:mx-3 md:mb-3 md:h-player-md md:px-4"
    >
      {/* Track info */}
      <div className="flex min-w-0 flex-1 items-center gap-3 md:w-64 md:flex-none">
        {currentSong ? (
          <motion.button
            type="button"
            layoutId={reducedMotion ? undefined : "player-artwork"}
            onClick={openNowPlaying}
            aria-label="Expand player"
            className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-2 text-muted-foreground"
          >
            <Image
              src={currentSong.coverUrl}
              alt=""
              width={48}
              height={48}
              className="size-full object-cover"
            />
          </motion.button>
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-2 text-muted-foreground">
            <Icon icon={Music2} size="md" />
          </div>
        )}
        <div className="min-w-0">
          {currentSong ? (
            isYoutubeAudioUrl(currentSong.audioUrl) ? (
              <>
                <Body className="truncate font-medium">{currentSong.title}</Body>
                <Caption className="block truncate">{currentSong.artistName}</Caption>
              </>
            ) : (
              <>
                <Link
                  href={`/album/${currentSong.albumId}`}
                  className="block truncate text-sm font-medium text-foreground hover:underline"
                >
                  {currentSong.title}
                </Link>
                <Link
                  href={`/artist/${currentSong.artistId}`}
                  className="block truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  {currentSong.artistName}
                </Link>
              </>
            )
          ) : (
            <>
              <Body className="truncate font-medium">Not playing</Body>
              <Caption className="block truncate">Pick a song to get started</Caption>
            </>
          )}
        </div>
        <IconButton
          disabled={!hasTrack}
          onClick={() => currentSong && toggleLikedSong(currentSong.id)}
          className="ml-1 hidden disabled:opacity-40 md:inline-flex"
          aria-label={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
          aria-pressed={liked}
        >
          <Icon icon={Heart} className={cn(liked && "fill-current text-accent-secondary")} />
        </IconButton>
      </div>

      {/* Transport controls */}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 md:max-w-xl">
        <div className="flex items-center gap-2 md:gap-4">
          <IconButton
            disabled={!hasTrack}
            onClick={toggleShuffle}
            className={cn("hidden disabled:opacity-40 md:inline-flex", shuffle && "text-primary")}
            aria-label="Shuffle"
            aria-pressed={shuffle}
          >
            <Icon icon={Shuffle} />
          </IconButton>
          <IconButton
            disabled={!hasTrack}
            onClick={previous}
            className="hidden disabled:opacity-40 md:inline-flex"
            aria-label="Previous"
          >
            <Icon icon={SkipBack} />
          </IconButton>
          <IconButton
            variant="primary"
            disabled={!hasTrack}
            onClick={togglePlay}
            className="size-9 disabled:opacity-40"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <Icon icon={isPlaying ? Pause : Play} className="fill-current" />
          </IconButton>
          <IconButton
            disabled={!hasTrack}
            onClick={next}
            className="hidden disabled:opacity-40 md:inline-flex"
            aria-label="Next"
          >
            <Icon icon={SkipForward} />
          </IconButton>
          <IconButton
            disabled={!hasTrack}
            onClick={cycleRepeatMode}
            className={cn(
              "hidden disabled:opacity-40 md:inline-flex",
              repeatMode !== "off" && "text-primary",
            )}
            aria-label={`Repeat: ${repeatMode}`}
            aria-pressed={repeatMode !== "off"}
          >
            <Icon icon={RepeatIcon} />
          </IconButton>
        </div>
        <PlaybackProgress
          currentTime={displayedTime}
          duration={duration}
          disabled={!hasTrack}
          onSeekPreview={setSeekPreview}
          onSeekCommit={(value) => {
            seekTo(value);
            setSeekPreview(null);
            announce(`Seeked to ${formatDuration(value)}`);
          }}
          className="hidden w-full items-center gap-2 md:flex"
        />
      </div>

      {/* Secondary controls */}
      <div className="hidden flex-1 items-center justify-end gap-2 md:flex md:w-64 md:flex-none">
        <IconButton disabled={!hasTrack} onClick={openQueue} className="disabled:opacity-40" aria-label="Queue">
          <Icon icon={ListMusic} />
        </IconButton>
        <VolumeProgress volume={volume} muted={muted} onVolumeChange={setVolume} onToggleMute={toggleMute} />
      </div>
    </div>
  );
}
