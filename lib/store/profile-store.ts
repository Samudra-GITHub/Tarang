import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_NAME = "Guest Listener";

interface ProfileState {
  name: string;
  email: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  signOut: () => void;
}

/**
 * Tarang has no backend, so there's no real authentication — this simply
 * remembers who's using the app locally, the same way every other
 * preference in the app persists (localStorage via Zustand).
 */
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: DEFAULT_NAME,
      email: "",
      setName: (name) => set({ name: name.trim() || DEFAULT_NAME }),
      setEmail: (email) => set({ email: email.trim() }),
      signOut: () => set({ name: DEFAULT_NAME, email: "" }),
    }),
    { name: "tarang-profile" },
  ),
);

export function initialFromName(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "G";
}
