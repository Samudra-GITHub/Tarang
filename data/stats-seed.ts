import { songs } from "@/data/songs";

export interface PlayEvent {
  songId: string;
  artistId: string;
  albumId: string;
  genre: string;
  timestamp: number;
}

function pickHour(): number {
  // Biased toward evening listening — a plausible pattern, not uniform noise.
  const r = Math.random();
  if (r < 0.15) return 6 + Math.floor(Math.random() * 5); // morning
  if (r < 0.35) return 12 + Math.floor(Math.random() * 5); // afternoon
  if (r < 0.8) return 17 + Math.floor(Math.random() * 4); // evening
  return 21 + Math.floor(Math.random() * 4) - 24; // late night (wraps via Date math below)
}

/**
 * One-time synthetic backfill so the Stats page looks like a real, lived-in
 * library on first visit. Real plays (via `logPlay`) accrue on top of this.
 */
export function generateSeedHistory(): PlayEvent[] {
  const events: PlayEvent[] = [];
  const now = new Date();
  // A handful of "favorite" tracks get replayed more, for a realistic top-artist skew.
  const favorites = [...songs.slice(0, 5), ...songs.slice(20, 25), ...songs.slice(35, 40)];
  const pool = [...songs, ...favorites, ...favorites];

  for (let daysAgo = 0; daysAgo < 90; daysAgo++) {
    const recentBoost = daysAgo < 6; // guarantees a visible current streak
    const activeToday = recentBoost || Math.random() < 0.5;
    if (!activeToday) continue;

    const playsToday = 1 + Math.floor(Math.random() * 6);
    for (let p = 0; p < playsToday; p++) {
      const song = pool[Math.floor(Math.random() * pool.length)];
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(pickHour(), Math.floor(Math.random() * 60), 0, 0);

      events.push({
        songId: song.id,
        artistId: song.artistId,
        albumId: song.albumId,
        genre: song.genre,
        timestamp: date.getTime(),
      });
    }
  }

  return events.sort((a, b) => a.timestamp - b.timestamp);
}
