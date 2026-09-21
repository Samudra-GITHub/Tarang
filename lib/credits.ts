import type { Song } from "@/types/music";

export interface SongCredits {
  writers: string[];
  producer: string;
  label: string;
  recordedAt: string;
  isrc: string;
  composer: string;
  engineer: string;
}

const PRODUCERS = [
  "Milo Achterberg",
  "Renata Cole",
  "Suri Vantage",
  "Desmond Okafor",
  "Ines Bregman",
  "Tobias Renn",
];

const ENGINEERS = [
  "Priya Anand",
  "Jonah Fisk",
  "Camille Duarte",
  "Aiden Walsh",
  "Marisol Ortiz",
];

const LABELS = ["Tarang Recordings", "Driftline Records", "Harbor & Co.", "Evercast Music"];

const CITIES = ["Mumbai", "Lisbon", "Austin", "Reykjavik", "Nairobi", "Seoul"];

/** A stable, deterministic pseudo-random index for a given seed and pool size. */
function seededIndex(seed: string, salt: string, size: number): number {
  let h = 0;
  const combined = `${seed}::${salt}`;
  for (let i = 0; i < combined.length; i++) h = combined.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % size;
}

/**
 * Plausible, deterministic session credits for a song — not real metadata (this
 * catalog has no licensed rights data), but stable per song so it reads as fact.
 */
export function getSongCredits(song: Song): SongCredits {
  const producer = PRODUCERS[seededIndex(song.id, "producer", PRODUCERS.length)];
  const engineer = ENGINEERS[seededIndex(song.id, "engineer", ENGINEERS.length)];
  const label = LABELS[seededIndex(song.id, "label", LABELS.length)];
  const city = CITIES[seededIndex(song.id, "city", CITIES.length)];
  const isrcDigits = String(1000000 + (seededIndex(song.id, "isrc", 8999999) % 8999999)).padStart(
    7,
    "0",
  );

  return {
    writers: [song.artistName, producer],
    composer: song.artistName,
    producer,
    engineer,
    label,
    recordedAt: `${city}, ${song.year}`,
    isrc: `TRG${String(song.year).slice(-2)}${isrcDigits}`,
  };
}
