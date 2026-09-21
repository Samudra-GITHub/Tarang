"use client";

import { useEffect, useRef } from "react";
import { useLibraryStore } from "@/lib/store/library-store";
import { useDownloadsStore } from "@/lib/store/downloads-store";

/**
 * When Smart Downloads is on, newly liked songs are downloaded automatically.
 * Mounted once, globally — renders nothing.
 */
export function SmartDownloadsSync() {
  const likedSongIds = useLibraryStore((state) => state.likedSongIds);
  const smartDownloads = useDownloadsStore((state) => state.smartDownloads);
  const downloadMany = useDownloadsStore((state) => state.downloadMany);
  const previousLiked = useRef<string[]>(likedSongIds);

  useEffect(() => {
    if (smartDownloads) {
      const newlyLiked = likedSongIds.filter((id) => !previousLiked.current.includes(id));
      if (newlyLiked.length > 0) downloadMany(newlyLiked);
    }
    previousLiked.current = likedSongIds;
  }, [likedSongIds, smartDownloads, downloadMany]);

  return null;
}
