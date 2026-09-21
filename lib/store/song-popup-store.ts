import { create } from "zustand";
import type { Song } from "@/types/music";

interface SongPopupState {
  song: Song | null;
  open: (song: Song) => void;
  close: () => void;
}

/** Drives the "quick look" popup opened from a song card — e.g. Trending Now. */
export const useSongPopupStore = create<SongPopupState>((set) => ({
  song: null,
  open: (song) => set({ song }),
  close: () => set({ song: null }),
}));
