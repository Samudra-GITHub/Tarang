import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateSeedHistory, type PlayEvent } from "@/data/stats-seed";

interface HistoryState {
  events: PlayEvent[];
  logPlay: (event: Omit<PlayEvent, "timestamp">) => void;
  seedIfEmpty: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      events: [],

      logPlay: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, timestamp: Date.now() }],
        })),

      seedIfEmpty: () => {
        if (get().events.length === 0) {
          set({ events: generateSeedHistory() });
        }
      },
    }),
    { name: "tarang-history" },
  ),
);
