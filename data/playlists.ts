import type { Playlist } from "@/types/music";
import { coverUrl } from "@/lib/placeholder";

export const playlists: Playlist[] = [
  {
    id: "playlist-chill-focus",
    title: "Chill Focus",
    description: "Soft indie textures and slow-burning grooves for deep work.",
    coverUrl: coverUrl("playlist-chill-focus"),
    songIds: [
      "album-analog-hearts-t1",
      "album-analog-hearts-t5",
      "album-slow-burn-t1",
      "album-slow-burn-t3",
      "album-tarang-t3",
      "album-tarang-t5",
    ],
  },
  {
    id: "playlist-late-night-drive",
    title: "Late Night Drive",
    description: "R&B and electronic tracks built for empty highways.",
    coverUrl: coverUrl("playlist-late-night-drive"),
    songIds: [
      "album-slow-burn-t2",
      "album-slow-burn-t4",
      "album-voltage-dreams-t2",
      "album-voltage-dreams-t4",
      "album-late-night-sessions-t2",
    ],
  },
  {
    id: "playlist-morning-motivation",
    title: "Morning Motivation",
    description: "Bright pop and hip-hop to start the day moving.",
    coverUrl: coverUrl("playlist-morning-motivation"),
    songIds: [
      "album-golden-hour-t1",
      "album-golden-hour-t4",
      "album-concrete-bloom-t1",
      "album-concrete-bloom-t5",
    ],
  },
  {
    id: "playlist-indie-discoveries",
    title: "Indie Discoveries",
    description: "Guitar-forward indie cuts from Echo Valley and friends.",
    coverUrl: coverUrl("playlist-indie-discoveries"),
    songIds: ["album-analog-hearts-t2", "album-analog-hearts-t3", "album-analog-hearts-t4"],
  },
  {
    id: "playlist-bass-and-bloom",
    title: "Bass & Bloom",
    description: "Hip-hop low end meets electronic sparkle.",
    coverUrl: coverUrl("playlist-bass-and-bloom"),
    songIds: [
      "album-concrete-bloom-t2",
      "album-concrete-bloom-t3",
      "album-voltage-dreams-t1",
      "album-voltage-dreams-t3",
      "album-voltage-dreams-t5",
    ],
  },
  {
    id: "playlist-jazz-after-dark",
    title: "Jazz After Dark",
    description: "Late-night sessions from the Paper Moon Collective.",
    coverUrl: coverUrl("playlist-jazz-after-dark"),
    songIds: [
      "album-late-night-sessions-t1",
      "album-late-night-sessions-t3",
      "album-late-night-sessions-t4",
      "album-late-night-sessions-t5",
    ],
  },
  {
    id: "playlist-raga-mornings",
    title: "Raga Mornings",
    description: "Devotional ragas and quiet mornings with Raga Horizon.",
    coverUrl: coverUrl("playlist-raga-mornings"),
    songIds: ["album-tarang-t2", "album-tarang-t4", "album-tarang-t1"],
  },
  {
    id: "playlist-tarang-essentials",
    title: "Tarang Essentials",
    description: "One standout track from every corner of the catalog.",
    coverUrl: coverUrl("playlist-tarang-essentials"),
    songIds: [
      "album-analog-hearts-t3",
      "album-voltage-dreams-t1",
      "album-golden-hour-t1",
      "album-concrete-bloom-t1",
      "album-static-stone-t2",
      "album-slow-burn-t1",
      "album-late-night-sessions-t1",
      "album-tarang-t1",
    ],
  },
];
