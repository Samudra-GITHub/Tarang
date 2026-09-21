import { create } from "zustand";
import type { Song } from "@/types/music";
import { shuffleArray } from "@/lib/shuffle";
import { useHistoryStore } from "@/lib/store/history-store";
import { useDownloadsStore } from "@/lib/store/downloads-store";
import { isYoutubeAudioUrl, videoIdFromAudioUrl, youtubeEngine } from "@/features/youtube/youtube-engine";

export type RepeatMode = "off" | "all" | "one";

interface PlayerState {
  /** Always in original/display order — shuffle never mutates this. */
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  sourceLabel: string | null;

  shuffle: boolean;
  /** Honest Shuffle: ids not yet played this pass, pre-randomized once. */
  shuffleUpcoming: string[];
  /** Ids played this shuffle session, most-recent last (excludes current). */
  shuffleHistory: string[];
  repeatMode: RepeatMode;

  /** A lower-priority holding queue, played once Up Next is exhausted. */
  playLater: Song[];

  playQueue: (songs: Song[], startIndex?: number, sourceLabel?: string) => void;
  playUpcoming: (songId: string) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;

  addNext: (song: Song) => void;
  addToEnd: (song: Song) => void;
  removeFromUpcoming: (index: number) => void;
  reorderUpcoming: (fromIndex: number, toIndex: number) => void;
  setUpcomingOrder: (newUpNext: Song[]) => void;
  clearUpcoming: () => void;

  addToPlayLater: (song: Song) => void;
  removeFromPlayLater: (index: number) => void;
  reorderPlayLater: (fromIndex: number, toIndex: number) => void;
  setPlayLaterOrder: (newOrder: Song[]) => void;
  clearPlayLater: () => void;
}

// A single audio element outlives the React tree entirely, so playback
// survives client-side route changes without any component keeping it alive.
let audioEl: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = "metadata";
    audioEl.volume = 0.8;

    audioEl.addEventListener("timeupdate", () => {
      usePlayerStore.setState({ currentTime: audioEl!.currentTime });
    });
    audioEl.addEventListener("loadedmetadata", () => {
      usePlayerStore.setState({ duration: audioEl!.duration || 0 });
    });
    audioEl.addEventListener("play", () => usePlayerStore.setState({ isPlaying: true }));
    audioEl.addEventListener("pause", () => usePlayerStore.setState({ isPlaying: false }));
    audioEl.addEventListener("ended", () => usePlayerStore.getState().next());
  }
  return audioEl;
}

/** Whether the currently-queued track should play through the YouTube engine rather than the native `<audio>` element. */
function currentTrackUsesYoutube(): boolean {
  const { queue, currentIndex } = usePlayerStore.getState();
  const song = queue[currentIndex];
  return Boolean(song && isYoutubeAudioUrl(song.audioUrl));
}

function loadTrack(song: Song, autoplay: boolean) {
  usePlayerStore.setState({ currentTime: 0, duration: 0 });

  if (isYoutubeAudioUrl(song.audioUrl)) {
    getAudio()?.pause();
    void youtubeEngine.load(videoIdFromAudioUrl(song.audioUrl), autoplay);
  } else {
    youtubeEngine.pause();
    const el = getAudio();
    if (!el) return;
    if (el.src !== song.audioUrl) {
      el.src = song.audioUrl;
    }
    el.currentTime = 0;
    if (autoplay) void el.play().catch(() => {});
  }

  if (autoplay) {
    useHistoryStore.getState().logPlay({
      songId: song.id,
      artistId: song.artistId,
      albumId: song.albumId,
      genre: song.genre,
    });
  }
}

// Bridges the isolated YouTube engine's events into this store — mirrors the
// native `<audio>` element's event listeners in `getAudio()` above, guarded
// so stray events from a background engine never clobber the active one.
youtubeEngine.onTimeUpdate((time) => {
  if (currentTrackUsesYoutube()) usePlayerStore.setState({ currentTime: time });
});
youtubeEngine.onDuration((duration) => {
  if (currentTrackUsesYoutube()) usePlayerStore.setState({ duration });
});
youtubeEngine.onPlay(() => {
  if (currentTrackUsesYoutube()) usePlayerStore.setState({ isPlaying: true });
});
youtubeEngine.onPause(() => {
  if (currentTrackUsesYoutube()) usePlayerStore.setState({ isPlaying: false });
});
youtubeEngine.onEnded(() => {
  if (currentTrackUsesYoutube()) usePlayerStore.getState().next();
});

/** Pulls the next song from the Play Later queue and makes it the current track, if any. */
function tryPlayFromLater(): boolean {
  const { playLater, queue, shuffle, shuffleHistory } = usePlayerStore.getState();
  if (playLater.length === 0) return false;

  const [nextSong, ...restLater] = playLater;
  const currentId = queue[usePlayerStore.getState().currentIndex]?.id;
  const alreadyInQueue = queue.some((s) => s.id === nextSong.id);
  const newQueue = alreadyInQueue ? queue : [...queue, nextSong];
  const newIndex = newQueue.findIndex((s) => s.id === nextSong.id);

  usePlayerStore.setState({
    queue: newQueue,
    currentIndex: newIndex,
    playLater: restLater,
    shuffleHistory: shuffle && currentId ? [...shuffleHistory, currentId] : shuffleHistory,
  });
  loadTrack(nextSong, true);
  return true;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  sourceLabel: null,

  shuffle: false,
  shuffleUpcoming: [],
  shuffleHistory: [],
  repeatMode: "off",
  playLater: [],

  playQueue: (songsToPlay, startIndex = 0, sourceLabel) => {
    const { offlineMode, downloadedSongIds } = useDownloadsStore.getState();
    let songs = songsToPlay;
    let start = startIndex;

    if (offlineMode) {
      const startId = songsToPlay[startIndex]?.id;
      songs = songsToPlay.filter((s) => downloadedSongIds.includes(s.id));
      if (songs.length === 0) return;
      const idx = startId ? songs.findIndex((s) => s.id === startId) : -1;
      start = idx >= 0 ? idx : 0;
    }

    if (songs.length === 0) return;
    set({
      queue: songs,
      currentIndex: start,
      sourceLabel: sourceLabel ?? null,
      shuffle: false,
      shuffleUpcoming: [],
      shuffleHistory: [],
    });
    loadTrack(songs[start], true);
  },

  playUpcoming: (songId) => {
    const { queue, shuffle, shuffleUpcoming, shuffleHistory, currentIndex } = get();
    const song = queue.find((s) => s.id === songId);
    if (!song) return;
    const targetIndex = queue.findIndex((s) => s.id === songId);
    const currentId = queue[currentIndex]?.id;

    if (shuffle) {
      set({
        shuffleUpcoming: shuffleUpcoming.filter((id) => id !== songId),
        shuffleHistory: currentId ? [...shuffleHistory, currentId] : shuffleHistory,
        currentIndex: targetIndex,
      });
    } else {
      set({ currentIndex: targetIndex });
    }
    loadTrack(song, true);
  },

  togglePlay: () => {
    const { isPlaying, queue } = get();
    if (queue.length === 0) return;
    if (currentTrackUsesYoutube()) {
      if (isPlaying) youtubeEngine.pause();
      else youtubeEngine.play();
      return;
    }
    const el = getAudio();
    if (!el) return;
    if (isPlaying) el.pause();
    else void el.play().catch(() => {});
  },

  play: () => {
    if (get().queue.length === 0) return;
    if (currentTrackUsesYoutube()) {
      youtubeEngine.play();
      return;
    }
    const el = getAudio();
    if (!el) return;
    void el.play().catch(() => {});
  },

  pause: () => {
    if (currentTrackUsesYoutube()) youtubeEngine.pause();
    else getAudio()?.pause();
  },

  next: () => {
    const { queue, currentIndex, repeatMode, shuffle, shuffleUpcoming, shuffleHistory } = get();
    if (queue.length === 0) return;

    if (repeatMode === "one") {
      loadTrack(queue[currentIndex], true);
      return;
    }

    if (shuffle) {
      const currentId = queue[currentIndex]?.id;
      let bag = shuffleUpcoming;

      if (bag.length === 0) {
        if (repeatMode === "all") {
          bag = shuffleArray(queue.map((s) => s.id).filter((id) => id !== currentId));
        } else {
          if (tryPlayFromLater()) return;
          getAudio()?.pause();
          set({ currentTime: 0 });
          return;
        }
      }

      const [nextId, ...rest] = bag;
      const nextIndex = queue.findIndex((s) => s.id === nextId);
      set({
        shuffleUpcoming: rest,
        shuffleHistory: currentId ? [...shuffleHistory, currentId] : shuffleHistory,
        currentIndex: nextIndex,
      });
      loadTrack(queue[nextIndex], true);
      return;
    }

    const isLast = currentIndex >= queue.length - 1;
    if (isLast && repeatMode !== "all") {
      if (tryPlayFromLater()) return;
      getAudio()?.pause();
      set({ currentTime: 0 });
      return;
    }
    const nextIndex = isLast ? 0 : currentIndex + 1;
    set({ currentIndex: nextIndex });
    loadTrack(queue[nextIndex], true);
  },

  previous: () => {
    const { queue, currentIndex, currentTime, shuffle, shuffleHistory, shuffleUpcoming } = get();
    if (queue.length === 0) return;

    // Standard UX: restart the current track if we're more than a few seconds in.
    if (currentTime > 3) {
      const el = getAudio();
      if (el) el.currentTime = 0;
      set({ currentTime: 0 });
      return;
    }

    if (shuffle && shuffleHistory.length > 0) {
      const previousId = shuffleHistory[shuffleHistory.length - 1];
      const currentId = queue[currentIndex]?.id;
      const previousIndex = queue.findIndex((s) => s.id === previousId);
      set({
        shuffleHistory: shuffleHistory.slice(0, -1),
        shuffleUpcoming: currentId ? [currentId, ...shuffleUpcoming] : shuffleUpcoming,
        currentIndex: previousIndex,
      });
      loadTrack(queue[previousIndex], true);
      return;
    }

    const prevIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
    set({ currentIndex: prevIndex });
    loadTrack(queue[prevIndex], true);
  },

  seekTo: (time) => {
    if (currentTrackUsesYoutube()) {
      youtubeEngine.seekTo(time);
      set({ currentTime: time });
      return;
    }
    const el = getAudio();
    if (!el) return;
    el.currentTime = time;
    set({ currentTime: time });
  },

  setVolume: (volume) => {
    const el = getAudio();
    const clamped = Math.min(1, Math.max(0, volume));
    if (el) el.volume = clamped;
    youtubeEngine.setVolume(clamped);
    set({ volume: clamped, muted: clamped === 0 });
  },

  toggleMute: () => {
    const el = getAudio();
    const { muted, volume } = get();
    const nextMuted = !muted;
    const effectiveVolume = nextMuted ? 0 : volume;
    if (el) el.volume = effectiveVolume;
    youtubeEngine.setVolume(effectiveVolume);
    set({ muted: nextMuted });
  },

  // Honest Shuffle: never repeats a track until every other track in the
  // queue has played once. The bag is pre-randomized and only refilled once
  // exhausted, per the product's "no repeats until exhausted" promise.
  toggleShuffle: () => {
    const { shuffle, queue, currentIndex } = get();
    if (!shuffle) {
      const currentId = queue[currentIndex]?.id;
      const bag = shuffleArray(queue.map((s) => s.id).filter((id) => id !== currentId));
      set({ shuffle: true, shuffleUpcoming: bag, shuffleHistory: currentId ? [currentId] : [] });
    } else {
      set({ shuffle: false, shuffleUpcoming: [], shuffleHistory: [] });
    }
  },

  cycleRepeatMode: () =>
    set((state) => ({
      repeatMode: state.repeatMode === "off" ? "all" : state.repeatMode === "all" ? "one" : "off",
    })),

  addNext: (song) => {
    const { shuffle, queue, currentIndex, shuffleUpcoming } = get();
    if (queue.length === 0) {
      get().playQueue([song], 0, song.title);
      return;
    }

    if (shuffle) {
      const inQueue = queue.some((s) => s.id === song.id);
      set({
        queue: inQueue ? queue : [...queue, song],
        shuffleUpcoming: [song.id, ...shuffleUpcoming.filter((id) => id !== song.id)],
      });
      return;
    }

    const before = queue.slice(0, currentIndex + 1);
    const after = queue.slice(currentIndex + 1).filter((s) => s.id !== song.id);
    set({ queue: [...before, song, ...after] });
  },

  addToEnd: (song) => {
    const { shuffle, queue, currentIndex, shuffleUpcoming } = get();
    if (queue.length === 0) {
      get().playQueue([song], 0, song.title);
      return;
    }

    if (shuffle) {
      const inQueue = queue.some((s) => s.id === song.id);
      set({
        queue: inQueue ? queue : [...queue, song],
        shuffleUpcoming: [...shuffleUpcoming.filter((id) => id !== song.id), song.id],
      });
      return;
    }

    const before = queue.slice(0, currentIndex + 1);
    const after = queue.slice(currentIndex + 1).filter((s) => s.id !== song.id);
    set({ queue: [...before, ...after, song] });
  },

  removeFromUpcoming: (index) => {
    const { shuffle, queue, currentIndex, shuffleUpcoming } = get();
    if (shuffle) {
      const next = [...shuffleUpcoming];
      next.splice(index, 1);
      set({ shuffleUpcoming: next });
    } else {
      const base = currentIndex + 1;
      const next = [...queue];
      next.splice(base + index, 1);
      set({ queue: next });
    }
  },

  reorderUpcoming: (fromIndex, toIndex) => {
    const { shuffle, queue, currentIndex, shuffleUpcoming } = get();
    if (shuffle) {
      const next = [...shuffleUpcoming];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      set({ shuffleUpcoming: next });
    } else {
      const base = currentIndex + 1;
      const next = [...queue];
      const [moved] = next.splice(base + fromIndex, 1);
      next.splice(base + toIndex, 0, moved);
      set({ queue: next });
    }
  },

  setUpcomingOrder: (newUpNext) => {
    const { shuffle, queue, currentIndex } = get();
    if (shuffle) {
      set({ shuffleUpcoming: newUpNext.map((s) => s.id) });
    } else {
      const before = queue.slice(0, currentIndex + 1);
      set({ queue: [...before, ...newUpNext] });
    }
  },

  clearUpcoming: () => {
    const { shuffle, queue, currentIndex } = get();
    if (shuffle) {
      set({ shuffleUpcoming: [] });
    } else {
      set({ queue: queue.slice(0, currentIndex + 1) });
    }
    set({ playLater: [] });
  },

  addToPlayLater: (song) =>
    set((state) => ({
      playLater: state.playLater.some((s) => s.id === song.id)
        ? state.playLater
        : [...state.playLater, song],
    })),

  removeFromPlayLater: (index) =>
    set((state) => {
      const next = [...state.playLater];
      next.splice(index, 1);
      return { playLater: next };
    }),

  reorderPlayLater: (fromIndex, toIndex) =>
    set((state) => {
      const next = [...state.playLater];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { playLater: next };
    }),

  setPlayLaterOrder: (newOrder) => set({ playLater: newOrder }),

  clearPlayLater: () => set({ playLater: [] }),
}));

export function selectUpNext(state: PlayerState): Song[] {
  if (state.shuffle) {
    return state.shuffleUpcoming
      .map((id) => state.queue.find((s) => s.id === id))
      .filter((song): song is Song => Boolean(song));
  }
  return state.queue.slice(state.currentIndex + 1);
}

export function selectHistory(state: PlayerState): Song[] {
  if (state.shuffle) {
    return state.shuffleHistory
      .map((id) => state.queue.find((s) => s.id === id))
      .filter((song): song is Song => Boolean(song))
      .reverse();
  }
  return state.queue.slice(0, Math.max(state.currentIndex, 0)).reverse();
}
