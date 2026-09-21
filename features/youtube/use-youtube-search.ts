"use client";

import { useEffect, useState } from "react";
import type { YoutubeSearchResult } from "./types";
import { searchYoutube, YoutubeSearchError, type YoutubeSearchErrorKind } from "./invidious-client";
import { getCachedSearch, setCachedSearch } from "./search-cache";

const DEBOUNCE_MS = 400;

export function useYoutubeSearch(query: string): {
  results: YoutubeSearchResult[];
  loading: boolean;
  errorKind: YoutubeSearchErrorKind | null;
  retry: () => void;
} {
  const [results, setResults] = useState<YoutubeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorKind, setErrorKind] = useState<YoutubeSearchErrorKind | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) {
      setResults([]);
      setErrorKind(null);
      setLoading(false);
      return;
    }

    const cached = getCachedSearch(trimmed);
    if (cached) {
      setResults(cached);
      setErrorKind(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorKind(null);

    const timer = setTimeout(() => {
      searchYoutube(trimmed)
        .then((data) => {
          if (cancelled) return;
          setResults(data);
          setCachedSearch(trimmed, data);
        })
        .catch((err) => {
          if (cancelled) return;
          setErrorKind(err instanceof YoutubeSearchError ? err.kind : "unavailable");
          setResults([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, retryToken]);

  return { results, loading, errorKind, retry: () => setRetryToken((t) => t + 1) };
}
