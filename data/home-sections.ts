import { albums } from "@/data/albums";
import { playlists } from "@/data/playlists";

export interface HomeMediaRef {
  kind: "album" | "playlist";
  id: string;
  /** Fraction listened, 0–1. Mocked until real listening history ships in Phase 5. */
  progress?: number;
}

export const continueListening: HomeMediaRef[] = [
  { kind: "album", id: albums[0].id, progress: 0.62 },
  { kind: "playlist", id: playlists[3].id, progress: 0.2 },
  { kind: "album", id: albums[4].id, progress: 0.85 },
  { kind: "playlist", id: playlists[6].id, progress: 0.4 },
];

export const recentlyPlayed: HomeMediaRef[] = [
  { kind: "playlist", id: playlists[0].id },
  { kind: "album", id: albums[2].id },
  { kind: "playlist", id: playlists[5].id },
  { kind: "album", id: albums[6].id },
  { kind: "playlist", id: playlists[1].id },
  { kind: "album", id: albums[7].id },
];
