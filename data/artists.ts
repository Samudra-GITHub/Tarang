import type { Artist } from "@/types/music";
import { coverUrl } from "@/lib/placeholder";

export const artists: Artist[] = [
  { id: "artist-echo-valley", name: "Echo Valley", genre: "Indie", coverUrl: coverUrl("artist-echo-valley") },
  { id: "artist-neon-static", name: "Neon Static", genre: "Electronic", coverUrl: coverUrl("artist-neon-static") },
  { id: "artist-marigold-sun", name: "Marigold Sun", genre: "Pop", coverUrl: coverUrl("artist-marigold-sun") },
  { id: "artist-velvet-cartel", name: "Velvet Cartel", genre: "Hip-Hop", coverUrl: coverUrl("artist-velvet-cartel") },
  { id: "artist-hollow-pines", name: "The Hollow Pines", genre: "Rock", coverUrl: coverUrl("artist-hollow-pines") },
  { id: "artist-indigo-root", name: "Indigo Root", genre: "R&B", coverUrl: coverUrl("artist-indigo-root") },
  { id: "artist-paper-moon", name: "Paper Moon Collective", genre: "Jazz", coverUrl: coverUrl("artist-paper-moon") },
  { id: "artist-raga-horizon", name: "Raga Horizon", genre: "Classical & Devotional", coverUrl: coverUrl("artist-raga-horizon") },
];
