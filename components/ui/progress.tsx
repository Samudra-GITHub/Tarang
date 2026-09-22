"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LinearProgressProps {
  /** 0–1 */
  value: number;
  className?: string;
  trackClassName?: string;
  "aria-label"?: string;
}

/** A determinate horizontal bar — card download/playback progress, storage usage. */
function LinearProgress({ value, className, trackClassName, ...props }: LinearProgressProps) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-surface-2", trackClassName)}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
        className={cn("h-full rounded-full bg-primary transition-all duration-300", className)}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}

export interface CircularProgressProps {
  /** 0–1. Omit for an indeterminate spin (delegates to Spinner's look). */
  value?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** A determinate ring — used wherever a percentage reads better as a circle than a bar. */
function CircularProgress({ value, size = 40, strokeWidth = 3, className }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = value === undefined ? undefined : Math.min(1, Math.max(0, value));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn(clamped === undefined && "animate-spin", className)}
      role="progressbar"
      aria-valuenow={clamped === undefined ? undefined : Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-surface-2"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="stroke-primary transition-[stroke-dashoffset] duration-300"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - (clamped ?? 0.25))}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export { LinearProgress, CircularProgress };
