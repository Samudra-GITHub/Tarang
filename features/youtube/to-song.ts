import type { Song } from "@/types/music";
import type { YoutubeSearchResult } from "./types";
import { toYoutubeAudioUrl } from "./youtube-engine";

/** Adapts a live YouTube search result into Tarang's Song shape so the existing queue, stats, pins, and downloads metadata all work on it unchanged. */
export function youtubeResultToSong(result: YoutubeSearchResult): Song {
  return {
    id: `yt-${result.videoId}`,
    title: result.title,
    artistId: `yt-channel-${result.author}`,
    artistName: result.author,
    albumId: `yt-single-${result.videoId}`,
    albumTitle: "Single",
    coverUrl: result.thumbnailUrl,
    duration: result.lengthSeconds,
    audioUrl: toYoutubeAudioUrl(result.videoId),
    genre: "Search",
    language: "Unknown",
    year: new Date().getFullYear(),
  };
}
