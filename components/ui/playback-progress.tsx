"use client";

import { Slider } from "@/components/ui/slider";
import { Mono } from "@/components/ui/typography";
import { formatDuration } from "@/lib/format-time";

export interface PlaybackProgressProps {
  currentTime: number;
  duration: number;
  disabled?: boolean;
  onSeekPreview: (value: number) => void;
  onSeekCommit: (value: number) => void;
  className?: string;
}

/** A seekable scrub bar with mono elapsed/remaining labels — the mini-player transport. */
function PlaybackProgress({
  currentTime,
  duration,
  disabled,
  onSeekPreview,
  onSeekCommit,
  className,
}: PlaybackProgressProps) {
  return (
    <div className={className ?? "flex w-full items-center gap-2"}>
      <Mono>{formatDuration(currentTime)}</Mono>
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        disabled={disabled}
        onValueChange={([value]) => onSeekPreview(value)}
        onValueCommit={([value]) => onSeekCommit(value)}
        className="min-w-0 flex-1"
        aria-label="Seek"
      />
      <Mono>{formatDuration(duration)}</Mono>
    </div>
  );
}

export { PlaybackProgress };
