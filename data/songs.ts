import type { Song } from "@/types/music";
import { albums } from "@/data/albums";
import { coverUrl, demoAudioUrl } from "@/lib/placeholder";

interface TrackSeed {
  title: string;
  duration: number;
}

const TRACKS_BY_ALBUM: Record<string, TrackSeed[]> = {
  "album-analog-hearts": [
    { title: "Paper Skies", duration: 198 },
    { title: "Static Bloom", duration: 221 },
    { title: "Analog Hearts", duration: 234 },
    { title: "Harbor Lights", duration: 206 },
    { title: "Slow Fade", duration: 251 },
  ],
  "album-voltage-dreams": [
    { title: "Voltage Dreams", duration: 214 },
    { title: "Neon Rain", duration: 227 },
    { title: "Circuit Breaker", duration: 195 },
    { title: "Afterglow", duration: 241 },
    { title: "Synth City", duration: 208 },
  ],
  "album-golden-hour": [
    { title: "Golden Hour", duration: 182 },
    { title: "Sunday Drive", duration: 199 },
    { title: "Marigold", duration: 176 },
    { title: "Electric Feeling", duration: 203 },
    { title: "Better Days", duration: 190 },
  ],
  "album-concrete-bloom": [
    { title: "Concrete Bloom", duration: 172 },
    { title: "Skyline", duration: 188 },
    { title: "No Ceiling", duration: 165 },
    { title: "Velvet Rope", duration: 179 },
    { title: "Uptown", duration: 193 },
  ],
  "album-static-stone": [
    { title: "Static & Stone", duration: 244 },
    { title: "Wildfire", duration: 218 },
    { title: "Gravel Road", duration: 256 },
    { title: "Iron Lung", duration: 232 },
    { title: "Last Light", duration: 267 },
  ],
  "album-slow-burn": [
    { title: "Slow Burn", duration: 224 },
    { title: "Midnight Call", duration: 209 },
    { title: "Honey", duration: 196 },
    { title: "Undertow", duration: 231 },
    { title: "Velvet Sky", duration: 215 },
  ],
  "album-late-night-sessions": [
    { title: "Late Night Sessions", duration: 312 },
    { title: "Blue Room", duration: 298 },
    { title: "Smoke Signal", duration: 276 },
    { title: "Midtown Waltz", duration: 334 },
    { title: "Closing Time", duration: 289 },
  ],
  "album-tarang": [
    { title: "Tarang", duration: 287 },
    { title: "Morning Raga", duration: 342 },
    { title: "River of Light", duration: 264 },
    { title: "Evening Aarti", duration: 301 },
    { title: "Waves of Silence", duration: 278 },
  ],
};

const LANGUAGE_BY_ALBUM: Record<string, string> = {
  "album-analog-hearts": "English",
  "album-voltage-dreams": "Instrumental",
  "album-golden-hour": "English",
  "album-concrete-bloom": "English",
  "album-static-stone": "English",
  "album-slow-burn": "English",
  "album-late-night-sessions": "Instrumental",
  "album-tarang": "Hindi",
};

export const songs: Song[] = albums.flatMap((album) => {
  const tracks = TRACKS_BY_ALBUM[album.id] ?? [];
  return tracks.map((track, index) => {
    const id = album.songIds[index];
    return {
      id,
      title: track.title,
      artistId: album.artistId,
      artistName: album.artistName,
      albumId: album.id,
      albumTitle: album.title,
      coverUrl: coverUrl(album.id),
      duration: track.duration,
      audioUrl: demoAudioUrl(albums.indexOf(album) * 5 + index),
      genre: album.genre,
      language: LANGUAGE_BY_ALBUM[album.id] ?? "English",
      year: album.year,
    } satisfies Song;
  });
});
