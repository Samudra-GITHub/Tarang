"use client";

import type { Playlist } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { getPlaylistSongs } from "@/lib/collections";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { PlayButton } from "@/components/ui/play-button";
import { Card, CardArtwork, CardBody, CardTitle, CardSubtitle } from "@/components/ui/card";

export function PlaylistCard({ playlist, progress }: { playlist: Playlist; progress?: number }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const glow = useDominantColor(playlist.coverUrl);

  return (
    <Card>
      <CardArtwork
        src={playlist.coverUrl}
        href={`/playlist/${playlist.id}`}
        ariaLabel={playlist.title}
        progress={progress}
        glowColor={glow}
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
