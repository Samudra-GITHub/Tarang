import type { GenreCollection } from "@/types/music";
import { coverUrl } from "@/lib/placeholder";

export const genres: GenreCollection[] = [
  { id: "genre-indie", name: "Indie", coverUrl: coverUrl("genre-indie") },
  { id: "genre-electronic", name: "Electronic", coverUrl: coverUrl("genre-electronic") },
  { id: "genre-pop", name: "Pop", coverUrl: coverUrl("genre-pop") },
  { id: "genre-hip-hop", name: "Hip-Hop", coverUrl: coverUrl("genre-hip-hop") },
  { id: "genre-rock", name: "Rock", coverUrl: coverUrl("genre-rock") },
  { id: "genre-rnb", name: "R&B", coverUrl: coverUrl("genre-rnb") },
  { id: "genre-jazz", name: "Jazz", coverUrl: coverUrl("genre-jazz") },
  { id: "genre-classical", name: "Classical & Devotional", coverUrl: coverUrl("genre-classical") },
];
