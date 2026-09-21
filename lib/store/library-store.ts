import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibraryState {
  /** Most-recently-liked first — doubles as "Recently Added" order. */
  likedSongIds: string[];
  savedAlbumIds: string[];
  savedPlaylistIds: string[];
  followedArtistIds: string[];
  /** id -> when it was added, for the Recently Added timeline and time-window filters. */
  addedAt: Record<string, number>;

  toggleLikedSong: (id: string) => void;
  toggleSavedAlbum: (id: string) => void;
  toggleSavedPlaylist: (id: string) => void;
  toggleFollowedArtist: (id: string) => void;
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [id, ...ids];
}

function toggleTimestamp(
  map: Record<string, number>,
  ids: string[],
  id: string,
): Record<string, number> {
  if (ids.includes(id)) {
    // was already added — this toggle is removing it, so drop the timestamp too.
    const next = { ...map };
    delete next[id];
    return next;
  }
  return { ...map, [id]: Date.now() };
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      likedSongIds: [],
      savedAlbumIds: [],
      savedPlaylistIds: [],
      followedArtistIds: [],
      addedAt: {},

      toggleLikedSong: (id) =>
        set((state) => ({
          likedSongIds: toggleId(state.likedSongIds, id),
          addedAt: toggleTimestamp(state.addedAt, state.likedSongIds, id),
        })),
      toggleSavedAlbum: (id) =>
        set((state) => ({
          savedAlbumIds: toggleId(state.savedAlbumIds, id),
          addedAt: toggleTimestamp(state.addedAt, state.savedAlbumIds, id),
        })),
      toggleSavedPlaylist: (id) =>
        set((state) => ({
          savedPlaylistIds: toggleId(state.savedPlaylistIds, id),
          addedAt: toggleTimestamp(state.addedAt, state.savedPlaylistIds, id),
        })),
      toggleFollowedArtist: (id) =>
        set((state) => ({ followedArtistIds: toggleId(state.followedArtistIds, id) })),
    }),
    { name: "tarang-library", version: 1 },
  ),
);
