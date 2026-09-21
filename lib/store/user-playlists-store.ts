import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Playlist } from "@/types/music";
import { coverUrl } from "@/lib/placeholder";

interface UserPlaylistsState {
  playlists: Playlist[];
  createPlaylist: (title: string, description?: string) => string;
  renamePlaylist: (id: string, title: string, description?: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (id: string, songId: string) => void;
  removeSongFromPlaylist: (id: string, songId: string) => void;
}

export const useUserPlaylistsStore = create<UserPlaylistsState>()(
  persist(
    (set) => ({
      playlists: [],

      createPlaylist: (title, description = "") => {
        const id = `user-playlist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const playlist: Playlist = {
          id,
          title: title.trim() || "New Playlist",
          description,
          coverUrl: coverUrl(id),
          songIds: [],
        };
        set((state) => ({ playlists: [playlist, ...state.playlists] }));
        return id;
      },

      renamePlaylist: (id, title, description) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === id ? { ...p, title, description: description ?? p.description } : p,
          ),
        })),

      deletePlaylist: (id) =>
        set((state) => ({ playlists: state.playlists.filter((p) => p.id !== id) })),

      addSongToPlaylist: (id, songId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === id && !p.songIds.includes(songId)
              ? { ...p, songIds: [...p.songIds, songId] }
              : p,
          ),
        })),

      removeSongFromPlaylist: (id, songId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === id ? { ...p, songIds: p.songIds.filter((s) => s !== songId) } : p,
          ),
        })),
    }),
    { name: "tarang-user-playlists" },
  ),
);
