import type { YoutubeSearchResult } from "./types";

export type YoutubeSearchErrorKind = "offline" | "timeout" | "unavailable";

export class YoutubeSearchError extends Error {
  kind: YoutubeSearchErrorKind;
  constructor(kind: YoutubeSearchErrorKind, message: string) {
    super(message);
    this.name = "YoutubeSearchError";
    this.kind = kind;
  }
}

/**
 * Public Invidious instances used for search, tried in order until one
 * responds. These are community-run and churn hard — most public instances
 * either go offline or drop CORS support within months. The first two below
 * were verified live and CORS-enabled at build time; the rest are a longer
 * fallback tail. If search stops working, check instance health and swap in
 * fresh ones from https://docs.invidious.io/instances/ (filter for API +
 * CORS support).
 */
export const INVIDIOUS_INSTANCES: string[] = [
  "https://invidious.f5.si",
  "https://invidious.flokinet.to",
  "https://yewtu.be",
  "https://inv.nadeko.net",
  "https://invidious.nerdvpn.de",
  "https://invidious.jing.rocks",
];

const FETCH_TIMEOUT_MS = 4500;

interface InvidiousVideoResult {
  type: string;
  videoId: string;
  title: string;
  author: string;
  lengthSeconds?: number;
}

/**
 * YouTube's own public thumbnail CDN, keyed only by videoId — used instead of
 * the Invidious instance's own thumbnail proxy URLs so thumbnails keep working
 * (and stay on a single next.config.ts-allowlisted host) no matter which
 * instance served the search results, or if that instance later goes offline.
 */
function thumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

function toResults(data: unknown): YoutubeSearchResult[] {
  if (!Array.isArray(data)) throw new Error("unexpected payload shape");
  return (data as InvidiousVideoResult[])
    .filter((item) => item.type === "video" && Boolean(item.videoId))
    .map((item) => ({
      videoId: item.videoId,
      title: item.title,
      author: item.author,
      lengthSeconds: item.lengthSeconds ?? 0,
      thumbnailUrl: thumbnailUrl(item.videoId),
    }));
}

async function fetchFromInstance(base: string, path: string): Promise<YoutubeSearchResult[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${base}${path}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`${base} responded with ${response.status}`);
    return toResults(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}

/** Tries every known instance in order with the same path, until one succeeds. */
async function fetchWithFallback(path: string): Promise<YoutubeSearchResult[]> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new YoutubeSearchError("offline", "You're offline.");
  }

  let allTimedOut = true;
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      return await fetchFromInstance(instance, path);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        allTimedOut = false;
      }
    }
  }

  throw allTimedOut
    ? new YoutubeSearchError("timeout", "Search timed out.")
    : new YoutubeSearchError("unavailable", "Search is temporarily unavailable.");
}

/** Biases results toward "official audio" uploads rather than music videos. */
function toAudioQuery(query: string): string {
  return `${query} audio`;
}

async function searchRaw(query: string): Promise<YoutubeSearchResult[]> {
  return fetchWithFallback(`/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
}

/** Searches YouTube via Invidious, falling back through instances until one succeeds. */
export async function searchYoutube(query: string): Promise<YoutubeSearchResult[]> {
  return searchRaw(toAudioQuery(query));
}

/**
 * A "trending right now" feed for songs. Invidious's own /trending endpoint
 * isn't reliably scoped to music across instances (it can surface whatever's
 * broadly trending, sports/news included), so this instead searches a small
 * rotating set of music-specific trending queries and merges the results —
 * reusing the same verified search + audio-bias path above.
 */
export async function getTrendingSongs(): Promise<YoutubeSearchResult[]> {
  const queries = ["trending songs this week", "viral songs right now", "top hits"];
  const batches = await Promise.all(
    queries.map((q) => searchRaw(toAudioQuery(q)).catch(() => [] as YoutubeSearchResult[])),
  );

  const seen = new Set<string>();
  const merged: YoutubeSearchResult[] = [];
  for (const batch of batches) {
    for (const result of batch) {
      if (seen.has(result.videoId)) continue;
      seen.add(result.videoId);
      merged.push(result);
    }
  }

  if (merged.length === 0) {
    throw new YoutubeSearchError("unavailable", "Trending is temporarily unavailable.");
  }
  return merged;
}
