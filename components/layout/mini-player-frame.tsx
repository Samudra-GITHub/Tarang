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
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format-time";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { usePlayerUIStore } from "@/lib/store/player-ui-store";
import { isYoutubeAudioUrl } from "@/features/youtube/youtube-engine";
import { useDominantColor } from "@/hooks/use-dominant-color";

export function MiniPlayerFrame() {
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
  const tint = useDominantColor(currentSong?.coverUrl);

  return (
    <div
      role="region"
      aria-label="Now playing"
      className="mx-2 mb-2 flex h-[72px] shrink-0 items-center gap-4 rounded-2xl border border-border-strong/60 bg-surface/90 px-3 backdrop-blur-xl transition-shadow duration-700 md:mx-3 md:mb-3 md:h-20 md:px-4"
      style={
        hasTrack
          ? {
              boxShadow: `0 -1px 0 0 color-mix(in srgb, ${tint} 35%, transparent) inset, 0 12px 40px -12px color-mix(in srgb, ${tint} 30%, transparent), 0 8px 24px -8px rgba(0,0,0,0.5)`,
            }
          : undefined
      }
    >
      {/* Track info */}
      <div className="flex min-w-0 flex-1 items-center gap-3 md:w-64 md:flex-none">
        {currentSong ? (
          <motion.button
            type="button"
            layoutId="player-artwork"
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
            <Music2 className="size-5" aria-hidden />
          </div>
        )}
        <div className="min-w-0">
          {currentSong ? (
            isYoutubeAudioUrl(currentSong.audioUrl) ? (
              <>
                <p className="truncate text-sm font-medium text-foreground">
                  {currentSong.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {currentSong.artistName}
                </p>
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
              <p className="truncate text-sm font-medium text-foreground">Not playing</p>
              <p className="truncate text-xs text-muted-foreground">
                Pick a song to get started
              </p>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          disabled={!hasTrack}
          onClick={() => currentSong && toggleLikedSong(currentSong.id)}
          className="ml-1 hidden rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40 md:inline-flex"
          aria-label={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
          aria-pressed={liked}
        >
          <Heart className={cn("size-4", liked && "fill-current text-accent-secondary")} aria-hidden />
        </Button>
      </div>

      {/* Transport controls */}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 md:max-w-xl">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            disabled={!hasTrack}
            onClick={toggleShuffle}
            className={cn(
              "hidden rounded-full disabled:opacity-40 md:inline-flex",
              shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="Shuffle"
            aria-pressed={shuffle}
          >
            <Shuffle className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!hasTrack}
            onClick={previous}
            className="hidden rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40 md:inline-flex"
            aria-label="Previous"
          >
            <SkipBack className="size-4" aria-hidden />
          </Button>
          <Button
            size="icon"
            disabled={!hasTrack}
            onClick={togglePlay}
            className="size-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" aria-hidden />
            ) : (
              <Play className="size-4 fill-current" aria-hidden />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!hasTrack}
            onClick={next}
            className="hidden rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40 md:inline-flex"
            aria-label="Next"
          >
            <SkipForward className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!hasTrack}
            onClick={cycleRepeatMode}
            className={cn(
              "hidden rounded-full disabled:opacity-40 md:inline-flex",
              repeatMode !== "off" ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={`Repeat: ${repeatMode}`}
            aria-pressed={repeatMode !== "off"}
          >
            <RepeatIcon className="size-4" aria-hidden />
          </Button>
        </div>
        <div className="hidden w-full items-center gap-2 md:flex">
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatDuration(displayedTime)}
          </span>
          <Slider
            value={[displayedTime]}
            max={duration || 100}
            step={1}
            disabled={!hasTrack}
            onValueChange={([value]) => setSeekPreview(value)}
            onValueCommit={([value]) => {
              seekTo(value);
              setSeekPreview(null);
            }}
            className="min-w-0 flex-1"
          />
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Secondary controls */}
      <div className="hidden flex-1 items-center justify-end gap-2 md:flex md:w-64 md:flex-none">
        <Button
          variant="ghost"
          size="icon"
          disabled={!hasTrack}
          onClick={openQueue}
          className="rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40"
          aria-label="Queue"
        >
          <ListMusic className="size-4" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="rounded-full text-muted-foreground hover:text-foreground"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted || volume === 0 ? (
            <VolumeX className="size-4" aria-hidden />
          ) : (
            <Volume2 className="size-4" aria-hidden />
          )}
        </Button>
        <Slider
          value={[muted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={([value]) => setVolume(value / 100)}
          className="w-24"
        />
      </div>
    </div>
  );
}
