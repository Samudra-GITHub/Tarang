import { songs } from "@/data/songs";
import { albums } from "@/data/albums";
import { playlists } from "@/data/playlists";
import type { Mood } from "@/data/moods";
import type { Album, Playlist, Song } from "@/types/music";

export function getSongsForIds(ids: string[]): Song[] {
  return ids
    .map((id) => songs.find((song) => song.id === id))
    .filter((song): song is Song => song !== undefined);
}

export function getAlbumSongs(album: Album): Song[] {
  return getSongsForIds(album.songIds);
}

export function getPlaylistSongs(playlist: Playlist): Song[] {
  return getSongsForIds(playlist.songIds);
}

export function getArtistAlbums(artistId: string): Album[] {
  return albums.filter((album) => album.artistId === artistId);
}

export function getArtistSongs(artistId: string, limit?: number): Song[] {
  const artistSongs = songs.filter((song) => song.artistId === artistId);
  return limit ? artistSongs.slice(0, limit) : artistSongs;
}

export function getMoodPlaylists(mood: Mood): Playlist[] {
  return mood.playlistIds
    .map((id) => playlists.find((p) => p.id === id))
    .filter((p): p is Playlist => p !== undefined);
}

/** The curated playlists' tracks, topped up with genre matches, deduped and capped. */
export function getMoodMix(mood: Mood, limit = 16): Song[] {
  const curated = getMoodPlaylists(mood).flatMap((playlist) => getPlaylistSongs(playlist));
  const seen = new Set(curated.map((song) => song.id));
  const extra = songs.filter((song) => mood.genres.includes(song.genre) && !seen.has(song.id));
  return [...curated, ...extra].slice(0, limit);
}

/** A representative cover for a mood's hero art and card glow — its first curated playlist. */
export function getMoodCoverUrl(mood: Mood): string {
  const [playlist] = getMoodPlaylists(mood);
  return playlist?.coverUrl ?? "";
}
