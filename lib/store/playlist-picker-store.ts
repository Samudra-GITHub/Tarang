import { create } from "zustand";

interface PlaylistPickerState {
  isOpen: boolean;
  /** The song to add once a playlist is chosen, or null when just creating one. */
  songId: string | null;
  open: (songId?: string) => void;
  close: () => void;
}

export const usePlaylistPickerStore = create<PlaylistPickerState>((set) => ({
  isOpen: false,
  songId: null,
  open: (songId) => set({ isOpen: true, songId: songId ?? null }),
  close: () => set({ isOpen: false, songId: null }),
}));
