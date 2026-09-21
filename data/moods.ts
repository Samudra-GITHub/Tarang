export type MoodEnvironment = "ripple" | "aurora" | "pulse" | "particles" | "waveform" | "wave";

export interface Mood {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Curated playlists that anchor this mood. */
  playlistIds: string[];
  /** Extra genres pulled in to round out the Mood Mix beyond the curated playlists. */
  genres: string[];
  /** Which animated environment renders behind the mood — its visual signature. */
  environment: MoodEnvironment;
}

export const moods: Mood[] = [
  {
    id: "mood-deep-focus",
    name: "Deep Focus",
    tagline: "Still water, steady mind.",
    description: "Soft indie textures and quiet ragas for uninterrupted work.",
    playlistIds: ["playlist-chill-focus", "playlist-raga-mornings"],
    genres: ["Indie", "Classical & Devotional"],
    environment: "ripple",
  },
  {
    id: "mood-late-night",
    name: "Late Night",
    tagline: "The city hums, you drift.",
    description: "Slow R&B and jazz for empty highways and low light.",
    playlistIds: ["playlist-late-night-drive", "playlist-jazz-after-dark"],
    genres: ["R&B", "Jazz"],
    environment: "aurora",
  },
  {
    id: "mood-morning-rise",
    name: "Morning Rise",
    tagline: "First light, first track.",
    description: "Bright pop and hip-hop to get you out the door.",
    playlistIds: ["playlist-morning-motivation"],
    genres: ["Pop"],
    environment: "pulse",
  },
  {
    id: "mood-bass-motion",
    name: "Bass & Motion",
    tagline: "Move like the low end.",
    description: "Hip-hop weight meets electronic sparkle.",
    playlistIds: ["playlist-bass-and-bloom"],
    genres: ["Hip-Hop", "Electronic"],
    environment: "particles",
  },
  {
    id: "mood-heart-on-sleeve",
    name: "Heart on Sleeve",
    tagline: "Feel it all the way through.",
    description: "Guitar-forward indie confessions and slow-burning soul.",
    playlistIds: ["playlist-indie-discoveries"],
    genres: ["Indie", "R&B"],
    environment: "waveform",
  },
  {
    id: "mood-devotional-calm",
    name: "Devotional Calm",
    tagline: "Tarang — the wave within.",
    description: "Ragas and devotional stillness from Raga Horizon.",
    playlistIds: ["playlist-raga-mornings"],
    genres: ["Classical & Devotional"],
    environment: "wave",
  },
];
