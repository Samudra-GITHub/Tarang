export interface Artist {
  id: string;
  name: string;
  genre: string;
  coverUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  year: number;
  genre: string;
  songIds: string[];
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  coverUrl: string;
  /** Display duration in seconds. Actual playback duration is authoritative once loaded. */
  duration: number;
  audioUrl: string;
  genre: string;
  language: string;
  /** Inherited from the parent album, denormalized for filtering. */
  year: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songIds: string[];
}

export interface GenreCollection {
  id: string;
  name: string;
  coverUrl: string;
}
