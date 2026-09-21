import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DownloadQuality = "standard" | "high" | "lossless";

/** Rough per-song size estimate by quality — for the storage indicator only. */
export const QUALITY_MB_PER_SONG: Record<DownloadQuality, number> = {
  standard: 3.5,
  high: 6.2,
  lossless: 24,
};

interface DownloadsState {
  /** Simulated — there's no real offline storage backend here. */
  downloadedSongIds: string[];
  downloadedAt: Record<string, number>;
  quality: DownloadQuality;
  smartDownloads: boolean;
  offlineMode: boolean;

  toggleDownloaded: (id: string) => void;
  downloadMany: (ids: string[]) => void;
  removeMany: (ids: string[]) => void;
  clearAll: () => void;
  setQuality: (quality: DownloadQuality) => void;
  toggleSmartDownloads: () => void;
  toggleOfflineMode: () => void;
}

export const useDownloadsStore = create<DownloadsState>()(
  persist(
    (set) => ({
      downloadedSongIds: [],
      downloadedAt: {},
      quality: "high",
      smartDownloads: false,
      offlineMode: false,

      toggleDownloaded: (id) =>
        set((state) => {
          const isDownloaded = state.downloadedSongIds.includes(id);
          const nextAt = { ...state.downloadedAt };
          if (isDownloaded) delete nextAt[id];
          else nextAt[id] = Date.now();
          return {
            downloadedSongIds: isDownloaded
              ? state.downloadedSongIds.filter((existing) => existing !== id)
              : [id, ...state.downloadedSongIds],
            downloadedAt: nextAt,
          };
        }),

      downloadMany: (ids) =>
        set((state) => {
          const nextAt = { ...state.downloadedAt };
          const now = Date.now();
          for (const id of ids) if (!(id in nextAt)) nextAt[id] = now;
          return {
            downloadedSongIds: Array.from(new Set([...ids, ...state.downloadedSongIds])),
            downloadedAt: nextAt,
          };
        }),

      removeMany: (ids) =>
        set((state) => {
          const nextAt = { ...state.downloadedAt };
          for (const id of ids) delete nextAt[id];
          return {
            downloadedSongIds: state.downloadedSongIds.filter((id) => !ids.includes(id)),
            downloadedAt: nextAt,
          };
        }),

      clearAll: () => set({ downloadedSongIds: [], downloadedAt: {} }),

      setQuality: (quality) => set({ quality }),
      toggleSmartDownloads: () => set((state) => ({ smartDownloads: !state.smartDownloads })),
      toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),
    }),
    { name: "tarang-downloads", version: 1 },
  ),
);
