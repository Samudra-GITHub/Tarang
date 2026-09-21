"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Download as DownloadIcon, Heart } from "lucide-react";
import { useLibraryStore } from "@/lib/store/library-store";
import { useDownloadsStore } from "@/lib/store/downloads-store";
import { albums } from "@/data/albums";
import { playlists } from "@/data/playlists";
import { songs } from "@/data/songs";
import { useUserPlaylistsStore } from "@/lib/store/user-playlists-store";
import { EmptyState } from "@/components/ui/empty-state";

type TimelineKind = "song" | "album" | "playlist" | "download";

interface TimelineEntry {
  kind: TimelineKind;
  id: string;
  timestamp: number;
  title: string;
  subtitle: string;
  coverUrl: string;
  href: string;
}

function bucketLabel(timestamp: number): "Today" | "Yesterday" | "This Week" | "Earlier" {
  const now = new Date();
  const date = new Date(timestamp);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.floor((startOfDay(now) - startOfDay(date)) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "This Week";
  return "Earlier";
}

const BUCKET_ORDER = ["Today", "Yesterday", "This Week", "Earlier"] as const;

export function RecentlyAddedTimeline() {
  const addedAt = useLibraryStore((state) => state.addedAt);
  const likedSongIds = useLibraryStore((state) => state.likedSongIds);
  const savedAlbumIds = useLibraryStore((state) => state.savedAlbumIds);
  const savedPlaylistIds = useLibraryStore((state) => state.savedPlaylistIds);
  const downloadedAt = useDownloadsStore((state) => state.downloadedAt);
  const userPlaylists = useUserPlaylistsStore((state) => state.playlists);

  const entries = useMemo(() => {
    const list: TimelineEntry[] = [];
    const songById = new Map(songs.map((s) => [s.id, s]));

    for (const id of likedSongIds) {
      const song = songById.get(id);
      const timestamp = addedAt[id];
      if (song && timestamp) {
        list.push({
          kind: "song",
          id,
          timestamp,
          title: song.title,
          subtitle: song.artistName,
          coverUrl: song.coverUrl,
          href: `/album/${song.albumId}`,
        });
      }
    }

    for (const id of savedAlbumIds) {
      const album = albums.find((a) => a.id === id);
      const timestamp = addedAt[id];
      if (album && timestamp) {
        list.push({
          kind: "album",
          id,
          timestamp,
          title: album.title,
          subtitle: album.artistName,
          coverUrl: album.coverUrl,
          href: `/album/${album.id}`,
        });
      }
    }

    for (const id of savedPlaylistIds) {
      const playlist = playlists.find((p) => p.id === id) ?? userPlaylists.find((p) => p.id === id);
      const timestamp = addedAt[id];
      if (playlist && timestamp) {
        list.push({
          kind: "playlist",
          id,
          timestamp,
          title: playlist.title,
          subtitle: playlist.description || "Playlist",
          coverUrl: playlist.coverUrl,
          href: `/playlist/${playlist.id}`,
        });
      }
    }

    for (const [id, timestamp] of Object.entries(downloadedAt)) {
      const song = songById.get(id);
      if (song) {
        list.push({
          kind: "download",
          id,
          timestamp,
          title: song.title,
          subtitle: song.artistName,
          coverUrl: song.coverUrl,
          href: `/album/${song.albumId}`,
        });
      }
    }

    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [addedAt, likedSongIds, savedAlbumIds, savedPlaylistIds, downloadedAt, userPlaylists]);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Nothing here yet"
        description="Like, save, or download something and it'll show up here, organized by when you added it."
        action={{ label: "Find music", href: "/search" }}
      />
    );
  }

  const grouped = BUCKET_ORDER.map((bucket) => ({
    bucket,
    items: entries.filter((entry) => bucketLabel(entry.timestamp) === bucket),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {grouped.map((group) => (
        <div key={group.bucket} className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {group.bucket}
          </h3>
          <div className="flex flex-col">
            {group.items.map((entry) => (
              <Link
                key={`${entry.kind}-${entry.id}`}
                href={entry.href}
                className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-2"
              >
                <Image
                  src={entry.coverUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{entry.subtitle}</p>
                </div>
                <KindBadge kind={entry.kind} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function KindBadge({ kind }: { kind: TimelineKind }) {
  if (kind === "download") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">
        <DownloadIcon className="size-3" aria-hidden />
        Downloaded
      </span>
    );
  }
  if (kind === "song") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">
        <Heart className="size-3" aria-hidden />
        Liked
      </span>
    );
  }
  return (
    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground capitalize">
      {kind}
    </span>
  );
}
