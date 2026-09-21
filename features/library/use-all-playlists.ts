"use client";

import { playlists as catalogPlaylists } from "@/data/playlists";
import { useUserPlaylistsStore } from "@/lib/store/user-playlists-store";
import type { Playlist } from "@/types/music";

/** User-created playlists first, then the editorial catalog. */
export function useAllPlaylists(): Playlist[] {
  const userPlaylists = useUserPlaylistsStore((state) => state.playlists);
  return [...userPlaylists, ...catalogPlaylists];
}
