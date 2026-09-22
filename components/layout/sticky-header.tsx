import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StickyHeaderProps {
  className?: string;
  children: ReactNode;
}

/**
 * Pins a page's title/action row to the top of its scroll container — used by
 * Search's search bar, Library's tabs, and the action row on Artist/Playlist/Mood headers.
 * No scroll listeners: plain CSS `position: sticky`.
 */
function StickyHeader({ className, children }: StickyHeaderProps) {
  return (
    <div className={cn("sticky top-0 z-20 border-b border-border bg-background py-3", className)}>
      {children}
    </div>
  );
}

export { StickyHeader };
