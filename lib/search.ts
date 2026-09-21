import { songs } from "@/data/songs";
import { albums } from "@/data/albums";
import { artists } from "@/data/artists";
import { playlists } from "@/data/playlists";
import type { Album, Artist, Playlist, Song } from "@/types/music";

export interface SearchResults {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

const RESULT_LIMIT = 8;

export function searchCatalog(query: string): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { songs: [], albums: [], artists: [], playlists: [] };

  return {
    songs: songs
      .filter((s) => s.title.toLowerCase().includes(q) || s.artistName.toLowerCase().includes(q))
      .slice(0, RESULT_LIMIT),
    albums: albums
      .filter((a) => a.title.toLowerCase().includes(q) || a.artistName.toLowerCase().includes(q))
      .slice(0, RESULT_LIMIT),
    artists: artists.filter((a) => a.name.toLowerCase().includes(q)).slice(0, RESULT_LIMIT),
    playlists: playlists
      .filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, RESULT_LIMIT),
  };
}

export function searchByGenre(genreName: string): SearchResults {
  const g = genreName.trim().toLowerCase();
  return {
    songs: songs.filter((s) => s.genre.toLowerCase() === g),
    albums: albums.filter((a) => a.genre.toLowerCase() === g),
    artists: artists.filter((a) => a.genre.toLowerCase() === g),
    playlists: [],
  };
}
