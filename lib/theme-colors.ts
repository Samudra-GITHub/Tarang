/**
 * Tarang's palette, duplicated as plain hex literals for the few renderers that
 * cannot consume CSS custom properties: `next/og` ImageResponse generators
 * (Satori has no DOM, so no `var(--token)`) and `<canvas>` 2D drawing. Every
 * other component uses the real tokens in styles/tokens.css — this file exists
 * only so those literals live in ONE place instead of being copy-pasted
 * per-file. Keep in sync with styles/tokens.css by hand.
 */
export const THEME_COLORS = {
  background: "#090909",
  surface: "#141414",
  surface2: "#1c1c1c",
  foreground: "#f2f2f0",
  mutedForeground: "#9a9a96",
  primary: "#2dd4bf",
} as const;
