"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { announce } from "@/lib/store/announce-store";

export interface VolumeProgressProps {
  volume: number;
  muted?: boolean;
  onVolumeChange: (value: number) => void;
  onToggleMute?: () => void;
  className?: string;
}

/** A volume slider with an optional mute toggle — mini-player and settings both use this. */
function VolumeProgress({ volume, muted = false, onVolumeChange, onToggleMute, className }: VolumeProgressProps) {
  const isSilent = muted || volume === 0;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onToggleMute && (
        <IconButton
          onClick={onToggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          size="sm"
        >
          {isSilent ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
        </IconButton>
      )}
      <Slider
        value={[muted ? 0 : volume * 100]}
        max={100}
        step={1}
        onValueChange={([value]) => onVolumeChange(value / 100)}
        onValueCommit={([value]) => announce(`Volume ${Math.round(value)}%`)}
        aria-label="Volume"
        className="w-24"
      />
    </div>
  );
}

export { VolumeProgress };
