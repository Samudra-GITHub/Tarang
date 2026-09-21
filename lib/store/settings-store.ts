import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  notifyTrending: boolean;
  toggleNotifyTrending: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifyTrending: true,
      toggleNotifyTrending: () => set((state) => ({ notifyTrending: !state.notifyTrending })),
    }),
    { name: "tarang-settings" },
  ),
);
