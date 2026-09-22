"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SearchX } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { FilterChip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Caption } from "@/components/ui/typography";
import type { Song } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { TrackRow } from "./track-row";

type SortMode = "default" | "title" | "artist" | "album" | "duration";

const SORT_LABELS: Record<SortMode, string> = {
  default: "Default",
  title: "Title",
  artist: "Artist",
  album: "Album",
  duration: "Duration",
};

export function TrackList({
  songs,
  sourceLabel,
  showAlbum = false,
  enableFilter = false,
  enableSort = false,
  selectable = false,
  selectedIds,
  onToggleSelect,
}: {
  songs: Song[];
  sourceLabel: string;
  showAlbum?: boolean;
  enableFilter?: boolean;
  enableSort?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const inputRef = useRef<HTMLInputElement>(null);
  const playQueue = usePlayerStore((state) => state.playQueue);

  // "/" focuses the search box — the classic power-user shortcut — unless
  // the user is already typing somewhere else.
  useEffect(() => {
    if (!enableFilter) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/") return;
      const target = event.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isTyping) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableFilter]);

  const query = filter.trim().toLowerCase();
  const filtered = query
    ? songs.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artistName.toLowerCase().includes(query) ||
          song.albumTitle.toLowerCase().includes(query),
      )
    : songs;

  // Sorting stays in effect while searching — filter narrows, sort orders.
  const visible = useMemo(() => {
    if (sortMode === "default") return filtered;
    const sorted = [...filtered];
    if (sortMode === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortMode === "artist") sorted.sort((a, b) => a.artistName.localeCompare(b.artistName));
    else if (sortMode === "album") sorted.sort((a, b) => a.albumTitle.localeCompare(b.albumTitle));
    else if (sortMode === "duration") sorted.sort((a, b) => a.duration - b.duration);
    return sorted;
  }, [filtered, sortMode]);

  return (
    <div className="flex flex-col gap-3">
      {(enableFilter || enableSort) && (
        <div className="flex flex-wrap items-center gap-3">
          {enableFilter && (
            <SearchInput
              ref={inputRef}
              value={filter}
              onChange={setFilter}
              placeholder="Search — press / to focus"
              className="max-w-xs"
            />
          )}
          {enableSort && (
            <div className="flex items-center gap-1.5">
              <Caption className="mr-1">Sort:</Caption>
              {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
                <FilterChip
                  key={mode}
                  selected={sortMode === mode}
                  onClick={() => setSortMode(mode)}
                  className="h-7 px-2.5 text-xs"
                >
                  {SORT_LABELS[mode]}
                </FilterChip>
              ))}
            </div>
          )}
        </div>
      )}
      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No songs found"
          description={query ? `Nothing matches "${filter.trim()}".` : "This list is empty."}
        />
      ) : (
        <div className="flex flex-col">
          {visible.map((song, index) => (
            <TrackRow
              key={song.id}
              song={song}
              index={index + 1}
              showAlbum={showAlbum}
              highlightQuery={query ? filter.trim() : undefined}
              onPlay={() => playQueue(visible, index, sourceLabel)}
              selectable={selectable}
              selected={selectedIds?.has(song.id)}
              onToggleSelect={() => onToggleSelect?.(song.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
