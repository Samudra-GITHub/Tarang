"use client";

import type { Album } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { getAlbumSongs } from "@/lib/collections";
import { PlayButton } from "@/components/ui/play-button";
import { Card, CardArtwork, CardBody, CardTitle, CardSubtitle } from "@/components/ui/card";

export function AlbumCard({ album, progress }: { album: Album; progress?: number }) {
  const playQueue = usePlayerStore((state) => state.playQueue);

  return (
    <Card>
      <CardArtwork
        src={album.coverUrl}
        href={`/album/${album.id}`}
        ariaLabel={`${album.title} by ${album.artistName}`}
        progress={progress}
      >
        <PlayButton
          label={`Play ${album.title}`}
          onPlay={() => playQueue(getAlbumSongs(album), 0, album.title)}
        />
      </CardArtwork>
      <CardBody>
        <CardTitle href={`/album/${album.id}`}>{album.title}</CardTitle>
        <CardSubtitle href={`/artist/${album.artistId}`}>{album.artistName}</CardSubtitle>
      </CardBody>
    </Card>
  );
}
