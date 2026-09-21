import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PinKind = "album" | "artist" | "playlist" | "song";

export interface PinnedItem {
  kind: PinKind;
  id: string;
  pinnedAt: number;
}

interface PinsState {
  pins: PinnedItem[];
  togglePin: (kind: PinKind, id: string) => void;
  isPinned: (kind: PinKind, id: string) => boolean;
}

export const usePinsStore = create<PinsState>()(
  persist(
    (set, get) => ({
      pins: [],

      togglePin: (kind, id) =>
        set((state) => {
          const exists = state.pins.some((p) => p.kind === kind && p.id === id);
          return {
            pins: exists
              ? state.pins.filter((p) => !(p.kind === kind && p.id === id))
              : [{ kind, id, pinnedAt: Date.now() }, ...state.pins],
          };
        }),

      isPinned: (kind, id) => get().pins.some((p) => p.kind === kind && p.id === id),
    }),
    { name: "tarang-pins" },
  ),
);
