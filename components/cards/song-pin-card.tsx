"use client";

import type { Song } from "@/types/music";
import { isYoutubeAudioUrl } from "@/features/youtube/youtube-engine";
import { PlayButton } from "@/components/ui/play-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardArtwork, CardBody, CardTitle, CardSubtitle } from "@/components/ui/card";

export function SongPinCard({ song, onPlay }: { song: Song; onPlay: () => void }) {
  const hasRealPages = !isYoutubeAudioUrl(song.audioUrl);

  return (
    <Card>
      <CardArtwork
        src={song.coverUrl}
        href={hasRealPages ? `/album/${song.albumId}` : undefined}
        onClick={hasRealPages ? undefined : onPlay}
        ariaLabel={
          hasRealPages
            ? `${song.title} by ${song.artistName}`
            : `Play ${song.title} by ${song.artistName}`
        }
        badge={<Badge variant="neutral">Song</Badge>}
      >
        <PlayButton label={`Play ${song.title}`} onPlay={onPlay} />
      </CardArtwork>
      <CardBody>
        <CardTitle>{song.title}</CardTitle>
        <CardSubtitle href={hasRealPages ? `/artist/${song.artistId}` : undefined}>
          {song.artistName}
        </CardSubtitle>
      </CardBody>
    </Card>
  );
}
