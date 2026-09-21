"use client";

import { useCallback, useEffect, useState } from "react";
import type { YoutubeSearchResult } from "./types";
import { getTrendingSongs } from "./invidious-client";
import { getCachedTrending, setCachedTrending } from "./trending-cache";

/** How often the trending feed is re-checked while the app stays open. */
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function useTrending(): {
  results: YoutubeSearchResult[];
  loading: boolean;
} {
  const [results, setResults] = useState<YoutubeSearchResult[]>(() => getCachedTrending() ?? []);
  const [loading, setLoading] = useState(results.length === 0);

  const refresh = useCallback(async () => {
    try {
      const data = await getTrendingSongs();
      setResults(data);
      setCachedTrending(data);
    } catch {
      // Keep showing whatever we already have (cached or previous fetch) — trending is
      // a nice-to-have rail, not worth a visible error state if a fetch fails.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { results, loading };
}
