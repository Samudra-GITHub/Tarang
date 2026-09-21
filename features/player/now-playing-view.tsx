"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  AudioLines,
  ChevronDown,
  Download,
  Heart,
  Info,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format-time";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { useDownloadsStore } from "@/lib/store/downloads-store";
import { usePlayerUIStore } from "@/lib/store/player-ui-store";
import { useVisualizerStore, VISUALIZER_STYLE_LABELS } from "@/lib/store/visualizer-store";
import { useCreditsUIStore } from "@/lib/store/credits-ui-store";
import { isYoutubeAudioUrl } from "@/features/youtube/youtube-engine";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { springSnappy } from "@/lib/motion";
import { LyricsView } from "./lyrics-view";
import { WaveformProgress } from "./waveform-progress";

export function NowPlayingView() {
  const isOpen = usePlayerUIStore((s) => s.isNowPlayingOpen);
  const closeNowPlaying = usePlayerUIStore((s) => s.closeNowPlaying);
  const showLyrics = usePlayerUIStore((s) => s.showLyrics);
  const toggleLyrics = usePlayerUIStore((s) => s.toggleLyrics);
  const openQueue = usePlayerUIStore((s) => s.openQueue);

  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const sourceLabel = usePlayerStore((s) => s.sourceLabel);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeatMode = usePlayerStore((s) => s.cycleRepeatMode);

  const likedSongIds = useLibraryStore((s) => s.likedSongIds);
  const toggleLikedSong = useLibraryStore((s) => s.toggleLikedSong);
  const downloadedSongIds = useDownloadsStore((s) => s.downloadedSongIds);
  const toggleDownloaded = useDownloadsStore((s) => s.toggleDownloaded);
  const visualizerStyle = useVisualizerStore((s) => s.style);
  const cycleVisualizerStyle = useVisualizerStore((s) => s.cycleStyle);
  const openCredits = useCreditsUIStore((s) => s.open);

  const [seekPreview, setSeekPreview] = useState<number | null>(null);
  const dragControls = useDragControls();

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : undefined;
  const backgroundColor = useDominantColor(currentSong?.coverUrl);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNowPlaying();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeNowPlaying]);

  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  if (!currentSong) return null;

  const liked = likedSongIds.includes(currentSong.id);
  const downloaded = downloadedSongIds.includes(currentSong.id);
  const displayedTime = seekPreview ?? currentTime;
  const progressFraction = duration > 0 ? displayedTime / duration : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120 || info.velocity.y > 600) closeNowPlaying();
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden text-foreground"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={currentSong.coverUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={currentSong.coverUrl}
                  alt=""
                  fill
                  sizes="100vw"
                  className="scale-125 object-cover blur-3xl"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${backgroundColor} 55%, transparent) 0%, var(--background) 78%)`,
              }}
            />
            <div className="absolute inset-0 bg-background/50" />
          </div>

          {/* Drag handle — swipe down to minimize */}
          <div
            onPointerDown={(event) => dragControls.start(event)}
            className="flex touch-none justify-center pt-2.5 pb-1 select-none"
          >
            <div className="h-1.5 w-10 cursor-grab rounded-full bg-white/25 active:cursor-grabbing" />
          </div>

          <div className="flex items-center justify-between px-4 pb-4 md:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-foreground hover:bg-white/10"
              onClick={closeNowPlaying}
              aria-label="Minimize"
            >
              <ChevronDown className="size-5" aria-hidden />
            </Button>
            <div className="text-center">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                Playing from
              </p>
              <p className="text-sm font-medium">{sourceLabel ?? "Tarang"}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-foreground hover:bg-white/10"
              onClick={openQueue}
              aria-label="Open queue"
            >
              <ListMusic className="size-5" aria-hidden />
            </Button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 pb-4">
            {showLyrics ? (
              <div className="h-full w-full max-w-xl">
                <LyricsView song={currentSong} />
              </div>
            ) : (
              <div className="relative mx-auto aspect-square w-full max-w-[min(80vw,380px)]">
                {isPlaying && (
                  <div
                    className="tarang-pulse absolute -inset-[6%] rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(circle, color-mix(in srgb, ${backgroundColor} 75%, transparent) 0%, transparent 72%)`,
                    }}
                    aria-hidden
                  />
                )}
                <motion.div
                  layoutId="player-artwork"
                  className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-white/10"
                  style={{
                    boxShadow: `0 30px 80px -20px rgba(0,0,0,0.8), 0 0 90px -25px color-mix(in srgb, ${backgroundColor} 70%, transparent)`,
                  }}
                >
                  <div className={cn("tarang-spin size-full", isPlaying && "is-spinning")}>
                    <Image
                      src={currentSong.coverUrl}
                      alt=""
                      fill
                      sizes="380px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {!showLyrics && (
              <div className="flex w-full max-w-[min(80vw,380px)] items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-heading text-xl font-bold tracking-tight">
                    {currentSong.title}
                  </p>
                  {isYoutubeAudioUrl(currentSong.audioUrl) ? (
                    <p className="truncate text-sm text-muted-foreground">
                      {currentSong.artistName}
                    </p>
                  ) : (
                    <Link
                      href={`/artist/${currentSong.artistId}`}
                      onClick={closeNowPlaying}
                      className="truncate text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {currentSong.artistName}
                    </Link>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full text-foreground hover:bg-white/10"
                  onClick={() => toggleLikedSong(currentSong.id)}
                  aria-label={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
                  aria-pressed={liked}
                >
                  <Heart
                    className={cn("size-5", liked && "fill-current text-accent-secondary")}
                    aria-hidden
                  />
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 px-6 pb-8 md:px-10">
            <div className="mx-auto flex w-full max-w-xl flex-col gap-1">
              <WaveformProgress
                songId={currentSong.id}
                progress={progressFraction}
                style={visualizerStyle}
                onSeekPreview={(fraction) => setSeekPreview(fraction * duration)}
                onSeekCommit={(fraction) => {
                  const time = fraction * duration;
                  seekTo(time);
                  setSeekPreview(null);
                }}
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {formatDuration(displayedTime)}
                </span>
                <button
                  type="button"
                  onClick={cycleVisualizerStyle}
                  className="rounded-full px-2 py-0.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                  aria-label={`Visualizer style: ${VISUALIZER_STYLE_LABELS[visualizerStyle]}. Tap to change.`}
                >
                  {VISUALIZER_STYLE_LABELS[visualizerStyle]}
                </button>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-xl items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={cn(
                  "rounded-full",
                  shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Shuffle"
                aria-pressed={shuffle}
              >
                <Shuffle className="size-5" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={previous}
                className="rounded-full text-foreground hover:bg-white/10"
                aria-label="Previous"
              >
                <SkipBack className="size-6 fill-current" aria-hidden />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                className="relative size-16 overflow-hidden rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isPlaying ? "pause" : "play"}
                    initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.4, opacity: 0, rotate: 90 }}
                    transition={springSnappy}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="size-7 fill-current" aria-hidden />
                    ) : (
                      <Play className="size-7 fill-current" aria-hidden />
                    )}
                  </motion.span>
                </AnimatePresence>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="rounded-full text-foreground hover:bg-white/10"
                aria-label="Next"
              >
                <SkipForward className="size-6 fill-current" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cycleRepeatMode}
                className={cn(
                  "rounded-full",
                  repeatMode !== "off"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={`Repeat: ${repeatMode}`}
                aria-pressed={repeatMode !== "off"}
              >
                <RepeatIcon className="size-5" aria-hidden />
              </Button>
            </div>

            <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLyrics}
                className={cn(
                  "rounded-full",
                  showLyrics ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="Lyrics"
                aria-pressed={showLyrics}
              >
                <Mic2 className="size-4" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cycleVisualizerStyle}
                className="rounded-full text-muted-foreground hover:text-foreground"
                aria-label={`Change visualizer style, currently ${VISUALIZER_STYLE_LABELS[visualizerStyle]}`}
              >
                <AudioLines className="size-4" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleDownloaded(currentSong.id)}
                className={cn(
                  "rounded-full",
                  downloaded ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={downloaded ? "Remove download" : "Download"}
                aria-pressed={downloaded}
              >
                <Download className="size-4" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openCredits(currentSong)}
                className="rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Song credits"
              >
                <Info className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
