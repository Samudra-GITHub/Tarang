import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tarang — तरङ्ग",
    short_name: "Tarang",
    description: "A music-first streaming app. Just the music.",
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#090909",
    icons: [
      { src: "/icons/manifest-192", sizes: "192x192", type: "image/png" },
      { src: "/icons/manifest-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
