"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Heart, Pin, Play } from "lucide-react";
import type { Album, Playlist } from "@/types/music";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAlbumSongs, getPlaylistSongs } from "@/lib/collections";
import { formatTotalDuration } from "@/lib/format-time";
import { usePlayerStore } from "@/lib/store/player-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { useDownloadsStore } from "@/lib/store/downloads-store";
import { usePinsStore } from "@/lib/store/pins-store";
import { BackdropArt } from "@/components/decorative/backdrop-art";
import { Display, Label } from "@/components/ui/typography";
import { toast } from "@/lib/store/toast-store";
import { StickyHeader } from "@/components/layout/sticky-header";
import { durations, easings } from "@/lib/motion";

type CollectionHeaderProps =
  | { kind: "album"; album: Album }
  | { kind: "playlist"; playlist: Playlist };

export function CollectionHeader(props: CollectionHeaderProps) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const savedAlbumIds = useLibraryStore((state) => state.savedAlbumIds);
  const savedPlaylistIds = useLibraryStore((state) => state.savedPlaylistIds);
  const toggleSavedAlbum = useLibraryStore((state) => state.toggleSavedAlbum);
  const toggleSavedPlaylist = useLibraryStore((state) => state.toggleSavedPlaylist);
  const downloadedSongIds = useDownloadsStore((state) => state.downloadedSongIds);
  const downloadMany = useDownloadsStore((state) => state.downloadMany);
  const removeMany = useDownloadsStore((state) => state.removeMany);
  const togglePin = usePinsStore((state) => state.togglePin);

  const isAlbum = props.kind === "album";
  const entity = isAlbum ? props.album : props.playlist;
  const pinned = usePinsStore((state) =>
    state.pins.some((p) => p.kind === props.kind && p.id === entity.id),
  );
  const songs = isAlbum ? getAlbumSongs(props.album) : getPlaylistSongs(props.playlist);
  const isSaved = isAlbum
    ? savedAlbumIds.includes(entity.id)
    : savedPlaylistIds.includes(entity.id);
  const totalDuration = songs.reduce((sum, song) => sum + song.duration, 0);
  const songIds = songs.map((song) => song.id);
  const isFullyDownloaded =
    songIds.length > 0 && songIds.every((id) => downloadedSongIds.includes(id));

  return (
    <div className="relative isolate pb-2">
      <BackdropArt src={entity.coverUrl} height="h-80 md:h-[400px]" />

      <div className="relative flex flex-col items-center gap-6 px-4 pt-10 text-center md:flex-row md:items-end md:px-6 md:pt-20 md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: durations.slow, ease: easings.emphasized }}
          className="relative size-48 shrink-0 overflow-hidden rounded-xl shadow-artwork-md ring-1 ring-white/10 md:size-56"
        >
          <Image src={entity.coverUrl} alt="" fill sizes="224px" className="object-cover" priority />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, delay: 0.15, ease: easings.decelerate }}
          className="flex flex-col gap-2"
        >
          <Label>{isAlbum ? "Album" : "Playlist"}</Label>
          <Display>{entity.title}</Display>
          {isAlbum ? (
            <Link
              href={`/artist/${props.album.artistId}`}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {props.album.artistName}
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">{props.playlist.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {songs.length} {songs.length === 1 ? "song" : "songs"} ·{" "}
            {formatTotalDuration(totalDuration)}
            {isAlbum ? ` · ${props.album.year}` : ""}
          </p>
        </motion.div>
      </div>
      <StickyHeader className="flex justify-center md:justify-start">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            className="size-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => playQueue(songs, 0, entity.title)}
            aria-label={`Play ${entity.title}`}
            disabled={songs.length === 0}
          >
            <Play className="size-5 fill-current" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() =>
              isAlbum ? toggleSavedAlbum(entity.id) : toggleSavedPlaylist(entity.id)
            }
            aria-label={isSaved ? "Remove from Your Library" : "Save to Your Library"}
            aria-pressed={isSaved}
          >
            <Heart
              className={cn("size-5", isSaved && "fill-current text-accent-secondary")}
              aria-hidden
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (isFullyDownloaded) {
                removeMany(songIds);
                toast.info("Download removed", entity.title);
              } else {
                downloadMany(songIds);
                toast.success("Downloaded", entity.title);
              }
            }}
            aria-label={isFullyDownloaded ? "Remove download" : "Download"}
            aria-pressed={isFullyDownloaded}
            disabled={songs.length === 0}
          >
            <Download
              className={cn("size-5", isFullyDownloaded && "text-primary")}
              aria-hidden
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => togglePin(props.kind, entity.id)}
            aria-label={pinned ? "Unpin" : "Pin to Home & Library"}
            aria-pressed={pinned}
          >
            <Pin className={cn("size-5", pinned && "fill-current text-primary")} aria-hidden />
          </Button>
        </div>
      </StickyHeader>
    </div>
  );
}
