"use client";

import { useMemo, useState } from "react";
import { Heart, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackList } from "@/components/tracks/track-list";
import { EmptyState } from "@/components/ui/empty-state";
import { useLibraryStore } from "@/lib/store/library-store";
import { useDownloadsStore } from "@/lib/store/downloads-store";
import { useHistoryStore } from "@/lib/store/history-store";
import { songs as catalogSongs } from "@/data/songs";
import type { Song } from "@/types/music";

type DurationBucket = "all" | "short" | "medium" | "long";

const DAY_MS = 24 * 60 * 60 * 1000;

function inDurationBucket(song: Song, bucket: DurationBucket): boolean {
  if (bucket === "all") return true;
  if (bucket === "short") return song.duration < 180;
  if (bucket === "medium") return song.duration >= 180 && song.duration <= 300;
  return song.duration > 300;
}

export function LibrarySongsPanel() {
  const likedSongIds = useLibraryStore((state) => state.likedSongIds);
  const addedAt = useLibraryStore((state) => state.addedAt);
  const downloadedSongIds = useDownloadsStore((state) => state.downloadedSongIds);
  const events = useHistoryStore((state) => state.events);

  const [genres, setGenres] = useState<Set<string>>(new Set());
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [years, setYears] = useState<Set<number>>(new Set());
  const [duration, setDuration] = useState<DurationBucket>("all");
  const [downloadedOnly, setDownloadedOnly] = useState(false);
  const [likedOnly, setLikedOnly] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(false);
  const [mostPlayed, setMostPlayed] = useState(false);

  const playCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of events) counts.set(event.songId, (counts.get(event.songId) ?? 0) + 1);
    return counts;
  }, [events]);

  const librarySongs = useMemo(() => {
    const byId = new Map(catalogSongs.map((song) => [song.id, song]));
    const ids = new Set([...likedSongIds, ...downloadedSongIds]);
    return Array.from(ids)
      .map((id) => byId.get(id))
      .filter((song): song is Song => Boolean(song));
  }, [likedSongIds, downloadedSongIds]);

  const availableGenres = useMemo(
    () => Array.from(new Set(librarySongs.map((s) => s.genre))).sort(),
    [librarySongs],
  );
  const availableLanguages = useMemo(
    () => Array.from(new Set(librarySongs.map((s) => s.language))).sort(),
    [librarySongs],
  );
  const availableYears = useMemo(
    () => Array.from(new Set(librarySongs.map((s) => s.year))).sort((a, b) => b - a),
    [librarySongs],
  );

  const toggleSetValue = <T,>(set: Set<T>, value: T, setter: (next: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const now = Date.now();
  const filtered = librarySongs.filter((song) => {
    if (genres.size > 0 && !genres.has(song.genre)) return false;
    if (languages.size > 0 && !languages.has(song.language)) return false;
    if (years.size > 0 && !years.has(song.year)) return false;
    if (!inDurationBucket(song, duration)) return false;
    if (downloadedOnly && !downloadedSongIds.includes(song.id)) return false;
    if (likedOnly && !likedSongIds.includes(song.id)) return false;
    if (recentlyAdded && (!addedAt[song.id] || now - addedAt[song.id] > 7 * DAY_MS)) return false;
    if (mostPlayed && (playCounts.get(song.id) ?? 0) === 0) return false;
    return true;
  });

  const visibleSongs = mostPlayed
    ? [...filtered].sort((a, b) => (playCounts.get(b.id) ?? 0) - (playCounts.get(a.id) ?? 0))
    : filtered;

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...Array.from(genres).map((g) => ({
      key: `genre-${g}`,
      label: g,
      onRemove: () => toggleSetValue(genres, g, setGenres),
    })),
    ...Array.from(languages).map((l) => ({
      key: `lang-${l}`,
      label: l,
      onRemove: () => toggleSetValue(languages, l, setLanguages),
    })),
    ...Array.from(years).map((y) => ({
      key: `year-${y}`,
      label: String(y),
      onRemove: () => toggleSetValue(years, y, setYears),
    })),
    ...(duration !== "all"
      ? [
          {
            key: "duration",
            label: duration === "short" ? "Under 3 min" : duration === "medium" ? "3–5 min" : "Over 5 min",
            onRemove: () => setDuration("all"),
          },
        ]
      : []),
    ...(downloadedOnly ? [{ key: "downloaded", label: "Downloaded", onRemove: () => setDownloadedOnly(false) }] : []),
    ...(likedOnly ? [{ key: "liked", label: "Liked", onRemove: () => setLikedOnly(false) }] : []),
    ...(recentlyAdded
      ? [{ key: "recent", label: "Recently Added", onRemove: () => setRecentlyAdded(false) }]
      : []),
    ...(mostPlayed ? [{ key: "played", label: "Most Played", onRemove: () => setMostPlayed(false) }] : []),
  ];

  if (librarySongs.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No songs in your library yet"
        description="Like songs or download them to build your collection."
        action={{ label: "Find music", href: "/search" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <FilterGroup label="Genre" options={availableGenres} active={genres} onToggle={(v) => toggleSetValue(genres, v, setGenres)} />
        <FilterGroup label="Language" options={availableLanguages} active={languages} onToggle={(v) => toggleSetValue(languages, v, setLanguages)} />
        <FilterGroup
          label="Year"
          options={availableYears.map(String)}
          active={new Set(Array.from(years).map(String))}
          onToggle={(v) => toggleSetValue(years, Number(v), setYears)}
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-muted-foreground">Duration</span>
          {(["all", "short", "medium", "long"] as DurationBucket[]).map((bucket) => (
            <button
              key={bucket}
              type="button"
              onClick={() => setDuration(bucket)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs",
                duration === bucket
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {bucket === "all" ? "Any" : bucket === "short" ? "Under 3 min" : bucket === "medium" ? "3–5 min" : "Over 5 min"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-muted-foreground">More</span>
          <ToggleChip label="Downloaded" active={downloadedOnly} onClick={() => setDownloadedOnly((v) => !v)} />
          <ToggleChip label="Liked" active={likedOnly} onClick={() => setLikedOnly((v) => !v)} />
          <ToggleChip label="Recently Added" active={recentlyAdded} onClick={() => setRecentlyAdded((v) => !v)} />
          <ToggleChip label="Most Played" active={mostPlayed} onClick={() => setMostPlayed((v) => !v)} />
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/25"
            >
              {chip.label}
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      {visibleSongs.length === 0 ? (
        <EmptyState icon={Music2} title="No matches" description="Try removing a filter to see more songs." />
      ) : (
        <TrackList songs={visibleSongs} sourceLabel="Your Library" showAlbum enableFilter enableSort={!mostPlayed} />
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: string[];
  active: Set<string>;
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-medium text-muted-foreground">{label}</span>
      {options.map((option) => (
        <ToggleChip key={option} label={option} active={active.has(option)} onClick={() => onToggle(option)} />
      ))}
    </div>
  );
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-2.5 py-1 text-xs transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
