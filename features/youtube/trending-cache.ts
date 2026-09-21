import type { YoutubeSearchResult } from "./types";

const CACHE_KEY = "tarang-trending-cache-v1";
const TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  timestamp: number;
  results: YoutubeSearchResult[];
}

function readEntry(): CacheEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheEntry) : null;
  } catch {
    return null;
  }
}

/** A cached hit, or null on a miss/expiry — callers fall back to a live fetch. */
export function getCachedTrending(): YoutubeSearchResult[] | null {
  const entry = readEntry();
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) return null;
  return entry.results;
}

export function setCachedTrending(results: YoutubeSearchResult[]) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), results }));
  } catch {
    // Storage can be full or unavailable (private mode) — caching is a nice-to-have, not required.
  }
}
