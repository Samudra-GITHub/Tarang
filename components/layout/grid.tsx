import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const GRID_PRESETS = {
  /** Album/pin grids — Library, Downloads. */
  cards: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  /** Genre browse tiles — Search. */
  genres: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  /** Settings-card groups — Downloads' toggles, Stats' tiles. */
  settings: "grid-cols-1 sm:grid-cols-3",
  /** Two-up stat panels — Stats' bar-list groups. */
  panels: "grid-cols-1 md:grid-cols-2",
} as const;

export interface GridProps {
  preset: keyof typeof GRID_PRESETS;
  className?: string;
  children: ReactNode;
}

/** The one responsive grid every card/tile group in Tarang uses — no bespoke column classes per screen. */
function Grid({ preset, className, children }: GridProps) {
  return <div className={cn("grid gap-4", GRID_PRESETS[preset], className)}>{children}</div>;
}

export { Grid };
