import type { MetadataRoute } from "next";
import { THEME_COLORS } from "@/lib/theme-colors";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tarang — तरङ्ग",
    short_name: "Tarang",
    description: "A music-first streaming app. Just the music.",
    start_url: "/",
    display: "standalone",
    background_color: THEME_COLORS.background,
    theme_color: THEME_COLORS.background,
    icons: [
      { src: "/icons/manifest-192", sizes: "192x192", type: "image/png" },
      { src: "/icons/manifest-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
