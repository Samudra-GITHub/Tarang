import type { PlayEvent } from "@/data/stats-seed";
import { artists } from "@/data/artists";
import { albums } from "@/data/albums";
import { songs } from "@/data/songs";

const durationById = new Map(songs.map((song) => [song.id, song.duration]));

export function computeTotalHours(events: PlayEvent[]): number {
  const totalSeconds = events.reduce((sum, e) => sum + (durationById.get(e.songId) ?? 0), 0);
  return totalSeconds / 3600;
}

function topBy<T>(
  events: PlayEvent[],
  keyFn: (event: PlayEvent) => string,
  resolve: (key: string) => T | undefined,
  limit: number,
): { item: T; count: number }[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    const key = keyFn(event);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ item: resolve(key), count }))
    .filter((entry): entry is { item: T; count: number } => entry.item !== undefined)
    .slice(0, limit);
}

export function computeTopArtists(events: PlayEvent[], limit = 5) {
  return topBy(
    events,
    (e) => e.artistId,
    (id) => artists.find((a) => a.id === id),
    limit,
  );
}

export function computeTopAlbums(events: PlayEvent[], limit = 5) {
  return topBy(
    events,
    (e) => e.albumId,
    (id) => albums.find((a) => a.id === id),
    limit,
  );
}

export function computeTopGenres(events: PlayEvent[], limit = 6) {
  return topBy(
    events,
    (e) => e.genre,
    (genre) => genre,
    limit,
  );
}

export interface TimeOfDayDistribution {
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
}

export function computeTimeOfDayDistribution(events: PlayEvent[]): TimeOfDayDistribution {
  const buckets: TimeOfDayDistribution = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  for (const event of events) {
    const hour = new Date(event.timestamp).getHours();
    if (hour >= 5 && hour < 12) buckets.morning++;
    else if (hour >= 12 && hour < 17) buckets.afternoon++;
    else if (hour >= 17 && hour < 21) buckets.evening++;
    else buckets.night++;
  }
  return buckets;
}

export function computeStreak(events: PlayEvent[]): number {
  const days = new Set(events.map((e) => new Date(e.timestamp).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export type JourneyBucketKey = "morning" | "afternoon" | "evening" | "night";

export interface JourneyEntry {
  key: JourneyBucketKey;
  label: string;
  hourRange: string;
  count: number;
  topGenre: string | null;
  recentSongIds: string[];
}

const JOURNEY_DEFS: { key: JourneyBucketKey; label: string; hourRange: string }[] = [
  { key: "morning", label: "Morning", hourRange: "5am – 12pm" },
  { key: "afternoon", label: "Afternoon", hourRange: "12pm – 5pm" },
  { key: "evening", label: "Evening", hourRange: "5pm – 9pm" },
  { key: "night", label: "Night", hourRange: "9pm – 5am" },
];

function journeyBucketForHour(hour: number): JourneyBucketKey {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/** Groups listening history by time of day, most-recent-first within each bucket. */
export function computeListeningJourney(events: PlayEvent[]): JourneyEntry[] {
  const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return JOURNEY_DEFS.map((def) => {
    const bucketEvents = sorted.filter(
      (e) => journeyBucketForHour(new Date(e.timestamp).getHours()) === def.key,
    );

    const genreCounts = new Map<string, number>();
    for (const e of bucketEvents) genreCounts.set(e.genre, (genreCounts.get(e.genre) ?? 0) + 1);
    const topGenre = [...genreCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    const recentSongIds: string[] = [];
    const seen = new Set<string>();
    for (const e of bucketEvents) {
      if (recentSongIds.length >= 6) break;
      if (seen.has(e.songId)) continue;
      seen.add(e.songId);
      recentSongIds.push(e.songId);
    }

    return { ...def, count: bucketEvents.length, topGenre, recentSongIds };
  });
}

export function computeMonthlyHistory(events: PlayEvent[], months = 6) {
  const now = new Date();
  const buckets: { label: string; count: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = bucketDate.toLocaleString("en-US", { month: "short" });
    const count = events.filter((e) => {
      const eventDate = new Date(e.timestamp);
      return (
        eventDate.getFullYear() === bucketDate.getFullYear() &&
        eventDate.getMonth() === bucketDate.getMonth()
      );
    }).length;
    buckets.push({ label, count });
  }
  return buckets;
}
