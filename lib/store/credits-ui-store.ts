import { create } from "zustand";
import type { Song } from "@/types/music";

interface CreditsUIState {
  song: Song | null;
  open: (song: Song) => void;
  close: () => void;
}

export const useCreditsUIStore = create<CreditsUIState>((set) => ({
  song: null,
  open: (song) => set({ song }),
  close: () => set({ song: null }),
}));
