import { create } from "zustand";

interface AnnounceState {
  message: string;
  count: number;
}

/**
 * A quiet, visually-hidden `aria-live` channel for high-frequency player/queue
 * state changes (play/pause, track change, seek, volume) that would be too
 * noisy as a visible toast. Rendered once by <LiveRegion /> in the app shell.
 */
export const useAnnounceStore = create<AnnounceState>(() => ({
  message: "",
  count: 0,
}));

/** Announce a message to screen readers — call from anywhere, mirrors `toast(...)`. */
export function announce(message: string) {
  useAnnounceStore.setState((state) => ({ message, count: state.count + 1 }));
}
