"use client";

import type { Playlist } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { getPlaylistSongs } from "@/lib/collections";
import { PlayButton } from "@/components/ui/play-button";
import { Card, CardArtwork, CardBody, CardTitle, CardSubtitle } from "@/components/ui/card";

export function PlaylistCard({ playlist, progress }: { playlist: Playlist; progress?: number }) {
  const playQueue = usePlayerStore((state) => state.playQueue);

  return (
    <Card>
      <CardArtwork
        src={playlist.coverUrl}
        href={`/playlist/${playlist.id}`}
        ariaLabel={playlist.title}
        progress={progress}
      >
        <PlayButton
          label={`Play ${playlist.title}`}
          onPlay={() => playQueue(getPlaylistSongs(playlist), 0, playlist.title)}
        />
      </CardArtwork>
      <CardBody>
        <CardTitle href={`/playlist/${playlist.id}`}>{playlist.title}</CardTitle>
        <CardSubtitle>{playlist.description}</CardSubtitle>
      </CardBody>
    </Card>
  );
}
