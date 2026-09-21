"use client";

import { albums } from "@/data/albums";
import { artists } from "@/data/artists";
import { playlists } from "@/data/playlists";
import { songs } from "@/data/songs";
import { useUserPlaylistsStore } from "@/lib/store/user-playlists-store";
import { usePlayerStore } from "@/lib/store/player-store";
import type { PinnedItem } from "@/lib/store/pins-store";
import { AlbumCard } from "./album-card";
import { PlaylistCard } from "./playlist-card";
import { ArtistCard } from "./artist-card";
import { SongPinCard } from "./song-pin-card";

export function PinnedItemCard({ pin }: { pin: PinnedItem }) {
  const userPlaylists = useUserPlaylistsStore((state) => state.playlists);
  const playQueue = usePlayerStore((state) => state.playQueue);

  if (pin.kind === "album") {
    const album = albums.find((a) => a.id === pin.id);
    return album ? <AlbumCard album={album} /> : null;
  }

  if (pin.kind === "artist") {
    const artist = artists.find((a) => a.id === pin.id);
    return artist ? <ArtistCard artist={artist} /> : null;
  }

  if (pin.kind === "playlist") {
    const playlist = playlists.find((p) => p.id === pin.id) ?? userPlaylists.find((p) => p.id === pin.id);
    return playlist ? <PlaylistCard playlist={playlist} /> : null;
  }

  if (pin.kind === "song") {
    const song = songs.find((s) => s.id === pin.id);
    if (!song) return null;
    return <SongPinCard song={song} onPlay={() => playQueue([song], 0, song.title)} />;
  }

  return null;
}
