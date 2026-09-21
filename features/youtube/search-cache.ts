import type { YoutubeSearchResult } from "./types";

// Bump the version suffix whenever the cached result shape changes, so
// stale entries from an older build are never replayed against new code.
const CACHE_KEY = "tarang-youtube-search-cache-v2";
const TTL_MS = 30 * 60 * 1000;
const MAX_ENTRIES = 40;

interface CacheEntry {
  timestamp: number;
  results: YoutubeSearchResult[];
}

type CacheStore = Record<string, CacheEntry>;

function readStore(): CacheStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: CacheStore) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    // Storage can be full or unavailable (private mode) — caching is a nice-to-have, not required.
  }
}

/** A cached hit, or null on a miss/expiry — callers fall back to a live search. */
export function getCachedSearch(query: string): YoutubeSearchResult[] | null {
  const entry = readStore()[query];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) return null;
  return entry.results;
}

export function setCachedSearch(query: string, results: YoutubeSearchResult[]) {
  const store = readStore();
  store[query] = { timestamp: Date.now(), results };

  const trimmed = Object.fromEntries(
    Object.entries(store)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .slice(0, MAX_ENTRIES),
  );
  writeStore(trimmed);
}
