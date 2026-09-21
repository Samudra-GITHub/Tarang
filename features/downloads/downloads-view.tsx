"use client";

import { useMemo, useState } from "react";
import { CloudDownload, HardDrive, Trash2, WifiOff, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AlbumCard } from "@/components/cards/album-card";
import { PlaylistCard } from "@/components/cards/playlist-card";
import { TrackList } from "@/components/tracks/track-list";
import { BarList } from "@/components/charts/bar-list";
import { cn } from "@/lib/utils";
import {
  QUALITY_MB_PER_SONG,
  useDownloadsStore,
  type DownloadQuality,
} from "@/lib/store/downloads-store";
import { albums } from "@/data/albums";
import { playlists } from "@/data/playlists";
import { songs } from "@/data/songs";
import { getAlbumSongs, getPlaylistSongs } from "@/lib/collections";

const QUALITY_LABELS: Record<DownloadQuality, string> = {
  standard: "Standard",
  high: "High",
  lossless: "Lossless",
};

/** Illustrative device cap for the storage usage bar — there's no real device here. */
const MOCK_DEVICE_CAP_MB = 4096;

export function DownloadsView() {
  const downloadedSongIds = useDownloadsStore((state) => state.downloadedSongIds);
  const clearAll = useDownloadsStore((state) => state.clearAll);
  const removeMany = useDownloadsStore((state) => state.removeMany);
  const quality = useDownloadsStore((state) => state.quality);
  const setQuality = useDownloadsStore((state) => state.setQuality);
  const smartDownloads = useDownloadsStore((state) => state.smartDownloads);
  const toggleSmartDownloads = useDownloadsStore((state) => state.toggleSmartDownloads);
  const offlineMode = useDownloadsStore((state) => state.offlineMode);
  const toggleOfflineMode = useDownloadsStore((state) => state.toggleOfflineMode);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const downloadedSongs = downloadedSongIds
    .map((id) => songs.find((song) => song.id === id))
    .filter((song): song is (typeof songs)[number] => Boolean(song));

  const downloadedAlbums = albums.filter((album) =>
    getAlbumSongs(album).every((song) => downloadedSongIds.includes(song.id)),
  );
  const downloadedPlaylists = playlists.filter((playlist) =>
    getPlaylistSongs(playlist).every((song) => downloadedSongIds.includes(song.id)),
  );

  const mbPerSong = QUALITY_MB_PER_SONG[quality];
  const totalMb = downloadedSongIds.length * mbPerSong;
  const usagePercent = Math.min(100, (totalMb / MOCK_DEVICE_CAP_MB) * 100);

  const genreBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const song of downloadedSongs) counts.set(song.genre, (counts.get(song.genre) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([genre, count]) => ({ key: genre, label: genre, value: Math.round(count * mbPerSong) }));
  }, [downloadedSongs, mbPerSong]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkRemove = () => {
    removeMany(Array.from(selectedIds));
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Downloads</h1>
        {downloadedSongIds.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Clear all
          </Button>
        )}
      </div>

      {/* Settings */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SettingCard
          icon={Zap}
          title="Smart Downloads"
          description="Automatically download songs you like."
          active={smartDownloads}
          onToggle={toggleSmartDownloads}
        />
        <SettingCard
          icon={WifiOff}
          title="Offline-Only Mode"
          description="Only play songs you've downloaded."
          active={offlineMode}
          onToggle={toggleOfflineMode}
        />
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-foreground">
            <CloudDownload className="size-4 text-primary" aria-hidden />
            <span className="text-sm font-medium">Download Quality</span>
          </div>
          <div className="flex gap-1.5">
            {(Object.keys(QUALITY_LABELS) as DownloadQuality[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuality(q)}
                className={cn(
                  "min-w-0 flex-1 truncate rounded-full px-2 py-1.5 text-xs font-medium transition-colors",
                  quality === q
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground",
                )}
              >
                {QUALITY_LABELS[q]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <HardDrive className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-sm font-medium">
              {downloadedSongIds.length} {downloadedSongIds.length === 1 ? "song" : "songs"} ·{" "}
              {totalMb.toFixed(0)} MB
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {usagePercent.toFixed(1)}% of {(MOCK_DEVICE_CAP_MB / 1024).toFixed(0)} GB
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        {genreBreakdown.length > 0 && (
          <div className="mt-2">
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              By Genre
            </p>
            <BarList items={genreBreakdown} />
          </div>
        )}
      </section>

      {downloadedSongIds.length === 0 ? (
        <EmptyState
          icon={CloudDownload}
          title="Nothing downloaded yet"
          description="Download songs, albums, or playlists to listen offline."
          action={{ label: "Find music", href: "/search" }}
        />
      ) : (
        <>
          {downloadedAlbums.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold tracking-tight">Albums</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {downloadedAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}

          {downloadedPlaylists.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold tracking-tight">Playlists</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {downloadedPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold tracking-tight">Songs</h2>
              <div className="flex items-center gap-3">
                {selectMode && selectedIds.size > 0 && (
                  <Button size="sm" variant="ghost" onClick={handleBulkRemove} className="gap-1.5 text-destructive">
                    <Trash2 className="size-3.5" aria-hidden />
                    Remove {selectedIds.size}
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectMode((v) => !v);
                    setSelectedIds(new Set());
                  }}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {selectMode ? "Done" : "Select"}
                </button>
              </div>
            </div>
            <TrackList
              songs={downloadedSongs}
              sourceLabel="Downloads"
              showAlbum
              enableFilter
              selectable={selectMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          </section>
        </>
      )}
    </div>
  );
}

function SettingCard({
  icon: Icon,
  title,
  description,
  active,
  onToggle,
}: {
  icon: typeof Zap;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors",
        active ? "border-primary/40 bg-primary/5" : "border-border bg-surface hover:bg-surface-2",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <span
          className={cn(
            "flex h-5 w-9 items-center rounded-full p-0.5 transition-colors",
            active ? "bg-primary" : "bg-surface-2",
          )}
        >
          <span
            className={cn(
              "size-4 rounded-full bg-white shadow transition-transform",
              active && "translate-x-4",
            )}
          />
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}
