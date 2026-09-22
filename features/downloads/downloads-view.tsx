"use client";

import { useMemo, useState } from "react";
import { CloudDownload, HardDrive, Trash2, WifiOff, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AlbumCard } from "@/components/cards/album-card";
import { PlaylistCard } from "@/components/cards/playlist-card";
import { TrackList } from "@/components/tracks/track-list";
import { BarList } from "@/components/charts/bar-list";
import { Label, Body, Caption } from "@/components/ui/typography";
import { FilterChip } from "@/components/ui/chip";
import { Switch } from "@/components/ui/switch";
import { LinearProgress } from "@/components/ui/progress";
import { toast } from "@/lib/store/toast-store";
import { Page, PageContainer, PageHeader } from "@/components/layout/page";
import { Section, SectionHeader, SectionTitle } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { HorizontalRail } from "@/components/layout/horizontal-rail";
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
    <PageContainer>
      <Page spacing="md">
      <PageHeader
        title="Downloads"
        actions={
          downloadedSongIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearAll();
                toast.info("All downloads removed");
              }}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Clear all
            </Button>
          )
        }
      />

      {/* Settings */}
      <Grid preset="settings" className="gap-3">
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
            <Body className="font-medium">Download Quality</Body>
          </div>
          <div className="flex gap-1.5">
            {(Object.keys(QUALITY_LABELS) as DownloadQuality[]).map((q) => (
              <FilterChip
                key={q}
                selected={quality === q}
                onClick={() => setQuality(q)}
                className="h-7 min-w-0 flex-1 truncate px-2 text-xs"
              >
                {QUALITY_LABELS[q]}
              </FilterChip>
            ))}
          </div>
        </div>
      </Grid>

      {/* Storage */}
      <Section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <HardDrive className="size-4 text-muted-foreground" aria-hidden />
            <Body className="font-medium">
              {downloadedSongIds.length} {downloadedSongIds.length === 1 ? "song" : "songs"} ·{" "}
              {totalMb.toFixed(0)} MB
            </Body>
          </div>
          <Caption>
            {usagePercent.toFixed(1)}% of {(MOCK_DEVICE_CAP_MB / 1024).toFixed(0)} GB
          </Caption>
        </div>
        <LinearProgress
          value={usagePercent / 100}
          trackClassName="h-1.5"
          className="duration-500"
          aria-label="Storage used"
        />
        {genreBreakdown.length > 0 && (
          <div className="mt-2">
            <Label className="mb-2 block">By Genre</Label>
            <BarList items={genreBreakdown} />
          </div>
        )}
      </Section>

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
            <HorizontalRail title="Albums" padded={false} className="gap-3" animate={false}>
              {downloadedAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </HorizontalRail>
          )}

          {downloadedPlaylists.length > 0 && (
            <HorizontalRail title="Playlists" padded={false} className="gap-3" animate={false}>
              {downloadedPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </HorizontalRail>
          )}

          <Section>
            <SectionHeader>
              <SectionTitle>Songs</SectionTitle>
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
            </SectionHeader>
            <TrackList
              songs={downloadedSongs}
              sourceLabel="Downloads"
              showAlbum
              enableFilter
              selectable={selectMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          </Section>
        </>
      )}
      </Page>
    </PageContainer>
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
  const labelId = `${title.replace(/\s+/g, "-").toLowerCase()}-label`;
  return (
    <div
      className={
        active
          ? "flex flex-col gap-2 rounded-lg border border-primary/40 bg-primary/5 p-4"
          : "flex flex-col gap-2 rounded-lg border border-border bg-surface p-4"
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={active ? "size-4 text-primary" : "size-4 text-muted-foreground"} aria-hidden />
          <Body id={labelId} className="font-medium">
            {title}
          </Body>
        </div>
        <Switch checked={active} onCheckedChange={onToggle} aria-labelledby={labelId} />
      </div>
      <Caption>{description}</Caption>
    </div>
  );
}
