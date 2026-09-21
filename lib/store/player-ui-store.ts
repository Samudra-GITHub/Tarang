import { create } from "zustand";

interface PlayerUIState {
  isNowPlayingOpen: boolean;
  isQueueOpen: boolean;
  showLyrics: boolean;

  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  openQueue: () => void;
  closeQueue: () => void;
  toggleLyrics: () => void;
}

export const usePlayerUIStore = create<PlayerUIState>((set) => ({
  isNowPlayingOpen: false,
  isQueueOpen: false,
  showLyrics: false,

  openNowPlaying: () => set({ isNowPlayingOpen: true }),
  closeNowPlaying: () => set({ isNowPlayingOpen: false, showLyrics: false }),
  openQueue: () => set({ isQueueOpen: true }),
  closeQueue: () => set({ isQueueOpen: false }),
  toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
}));
