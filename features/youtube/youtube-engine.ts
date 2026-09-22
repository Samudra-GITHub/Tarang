"use client";

/**
 * A minimal, store-agnostic wrapper around the official YouTube IFrame Player
 * API. It knows nothing about Tarang's player-store — it just loads/plays/
 * pauses/seeks a hidden player and emits events, so `lib/store/player-store.ts`
 * can bridge those events into its own state exactly like it already does
 * for the native `<audio>` element.
 */

interface YTPlayerLike {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  destroy: () => void;
}

interface YTPlayerStateConstants {
  PLAYING: number;
  PAUSED: number;
  ENDED: number;
  BUFFERING: number;
  CUED: number;
}

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, options: Record<string, unknown>) => YTPlayerLike;
      PlayerState: YTPlayerStateConstants;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YOUTUBE_PLAYER_CONTAINER_ID = "tarang-youtube-player";
const POLL_INTERVAL_MS = 500;

type TimeListener = (time: number) => void;
type Listener = () => void;

const listeners = {
  timeupdate: new Set<TimeListener>(),
  duration: new Set<TimeListener>(),
  play: new Set<Listener>(),
  pause: new Set<Listener>(),
  ended: new Set<Listener>(),
};

let player: YTPlayerLike | null = null;
let apiReadyPromise: Promise<void> | null = null;
let playerReadyPromise: Promise<YTPlayerLike> | null = null;
let pollHandle: ReturnType<typeof setInterval> | null = null;

function loadIframeApi(): Promise<void> {
  if (apiReadyPromise) return apiReadyPromise;
  apiReadyPromise = new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    if (!document.getElementById("tarang-youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "tarang-youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
  return apiReadyPromise;
}

function startPolling() {
  if (pollHandle) return;
  pollHandle = setInterval(() => {
    if (!player) return;
    const time = player.getCurrentTime();
    listeners.timeupdate.forEach((cb) => cb(time));
  }, POLL_INTERVAL_MS);
}

/** Stops the currentTime poll while nothing is playing — no point ticking every 500ms while paused/idle. */
function stopPolling() {
  if (!pollHandle) return;
  clearInterval(pollHandle);
  pollHandle = null;
}

function ensurePlayer(): Promise<YTPlayerLike> {
  if (playerReadyPromise) return playerReadyPromise;

  playerReadyPromise = loadIframeApi().then(
    () =>
      new Promise<YTPlayerLike>((resolve) => {
        const YT = window.YT!;
        player = new YT.Player(YOUTUBE_PLAYER_CONTAINER_ID, {
          height: "0",
          width: "0",
          playerVars: { controls: 0, disablekb: 1, playsinline: 1, modestbranding: 1 },
          events: {
            onReady: () => {
              resolve(player!);
            },
            onStateChange: (event: { data: number }) => {
              const state = YT.PlayerState;
              if (event.data === state.PLAYING) {
                startPolling();
                listeners.duration.forEach((cb) => cb(player!.getDuration()));
                listeners.play.forEach((cb) => cb());
              } else if (event.data === state.PAUSED) {
                stopPolling();
                listeners.pause.forEach((cb) => cb());
              } else if (event.data === state.ENDED) {
                stopPolling();
                listeners.ended.forEach((cb) => cb());
              }
            },
          },
        });
      }),
  );
  return playerReadyPromise;
}

export const youtubeEngine = {
  async load(videoId: string, autoplay: boolean) {
    const activePlayer = await ensurePlayer();
    if (autoplay) activePlayer.loadVideoById(videoId);
    else activePlayer.cueVideoById(videoId);
  },
  play: () => player?.playVideo(),
  pause: () => player?.pauseVideo(),
  seekTo: (seconds: number) => player?.seekTo(seconds, true),
  setVolume: (fraction: number) => player?.setVolume(Math.round(fraction * 100)),
  getCurrentTime: () => player?.getCurrentTime() ?? 0,
  getDuration: () => player?.getDuration() ?? 0,
  onTimeUpdate: (cb: TimeListener) => {
    listeners.timeupdate.add(cb);
    return () => listeners.timeupdate.delete(cb);
  },
  onDuration: (cb: TimeListener) => {
    listeners.duration.add(cb);
    return () => listeners.duration.delete(cb);
  },
  onPlay: (cb: Listener) => {
    listeners.play.add(cb);
    return () => listeners.play.delete(cb);
  },
  onPause: (cb: Listener) => {
    listeners.pause.add(cb);
    return () => listeners.pause.delete(cb);
  },
  onEnded: (cb: Listener) => {
    listeners.ended.add(cb);
    return () => listeners.ended.delete(cb);
  },
};

const YOUTUBE_URL_PREFIX = "youtube:";

export function isYoutubeAudioUrl(url: string): boolean {
  return url.startsWith(YOUTUBE_URL_PREFIX);
}

export function videoIdFromAudioUrl(url: string): string {
  return url.slice(YOUTUBE_URL_PREFIX.length);
}

export function toYoutubeAudioUrl(videoId: string): string {
  return `${YOUTUBE_URL_PREFIX}${videoId}`;
}
