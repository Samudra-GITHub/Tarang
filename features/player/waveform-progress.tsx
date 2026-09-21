"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { VisualizerStyle } from "@/lib/store/visualizer-store";

/** Deterministic pseudo-waveform, seeded per track so it stays stable across renders. */
function seededBars(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  let state = Math.abs(h) || 1;
  const rand = () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };

  const bars: number[] = [];
  let momentum = 0.6;
  for (let i = 0; i < count; i++) {
    momentum = momentum * 0.7 + rand() * 0.3;
    bars.push(0.2 + momentum * 0.8);
  }
  return bars;
}

function BarsVisualizer({ bars, progress }: { bars: number[]; progress: number }) {
  return (
    <div className="flex h-full w-full items-center gap-[3px]">
      {bars.map((height, index) => {
        const played = index / bars.length <= progress;
        return (
          <span
            key={index}
            className={cn(
              "min-w-[2px] flex-1 rounded-full transition-colors duration-150",
              played ? "bg-primary" : "bg-white/15",
            )}
            style={{
              height: `${height * 100}%`,
              boxShadow: played
                ? "0 0 8px color-mix(in srgb, var(--primary) 60%, transparent)"
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

function MirrorVisualizer({ bars, progress }: { bars: number[]; progress: number }) {
  return (
    <div className="flex h-full w-full items-center gap-[3px]">
      {bars.map((height, index) => {
        const played = index / bars.length <= progress;
        return (
          <div key={index} className="flex flex-1 flex-col items-center gap-[2px]">
            <span
              className={cn(
                "min-w-[2px] w-full rounded-full transition-colors duration-150",
                played ? "bg-primary" : "bg-white/15",
              )}
              style={{ height: `${height * 45}%` }}
            />
            <span
              className={cn(
                "min-w-[2px] w-full rounded-full opacity-50 transition-colors duration-150",
                played ? "bg-primary" : "bg-white/15",
              )}
              style={{ height: `${height * 30}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function DotsVisualizer({ bars, progress }: { bars: number[]; progress: number }) {
  return (
    <div className="flex h-full w-full items-center gap-[3px]">
      {bars.map((height, index) => {
        const played = index / bars.length <= progress;
        const size = 4 + height * 12;
        return (
          <span
            key={index}
            className={cn(
              "mx-auto shrink-0 rounded-full transition-colors duration-150",
              played ? "bg-primary" : "bg-white/20",
            )}
            style={{
              width: size,
              height: size,
              boxShadow: played
                ? "0 0 6px color-mix(in srgb, var(--primary) 65%, transparent)"
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

function LineVisualizer({ bars, progress }: { bars: number[]; progress: number }) {
  const points = bars
    .map((height, index) => {
      const x = (index / (bars.length - 1)) * 100;
      const y = 40 - height * 36;
      return `${x},${y}`;
    })
    .join(" ");
  const dash = Math.max(0, Math.min(100, progress * 100));

  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
      <polyline
        points={points}
        fill="none"
        stroke="rgb(255 255 255 / 15%)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray={`${dash} ${100 - dash}`}
        style={{ filter: "drop-shadow(0 0 4px color-mix(in srgb, var(--primary) 60%, transparent))" }}
      />
    </svg>
  );
}

export function WaveformProgress({
  songId,
  progress,
  style = "bars",
  onSeekPreview,
  onSeekCommit,
}: {
  songId: string;
  /** 0–1 */
  progress: number;
  style?: VisualizerStyle;
  onSeekPreview: (fraction: number) => void;
  onSeekCommit: (fraction: number) => void;
}) {
  const barCount = style === "dots" ? 32 : 56;
  const bars = useMemo(() => seededBars(songId, barCount), [songId, barCount]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const fractionAt = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return progress;
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      tabIndex={0}
      onPointerDown={(event) => {
        setDragging(true);
        onSeekPreview(fractionAt(event.clientX));
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Ignore — some synthetic/edge-case pointers can't be captured; dragging still works via onPointerMove.
        }
      }}
      onPointerMove={(event) => {
        if (dragging) onSeekPreview(fractionAt(event.clientX));
      }}
      onPointerUp={(event) => {
        setDragging(false);
        onSeekCommit(fractionAt(event.clientX));
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onSeekCommit(Math.min(1, progress + 0.02));
        if (event.key === "ArrowLeft") onSeekCommit(Math.max(0, progress - 0.02));
      }}
      className="h-11 w-full cursor-pointer touch-none select-none"
    >
      {style === "bars" && <BarsVisualizer bars={bars} progress={progress} />}
      {style === "mirror" && <MirrorVisualizer bars={bars} progress={progress} />}
      {style === "dots" && <DotsVisualizer bars={bars} progress={progress} />}
      {style === "line" && <LineVisualizer bars={bars} progress={progress} />}
    </div>
  );
}
