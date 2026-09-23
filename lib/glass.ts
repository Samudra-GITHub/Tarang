/**
 * Tarang's frosted-glass recipe — the one place "glassmorphism" is defined.
 * Every floating chrome surface (sidebar, dock, search bar, quick actions,
 * the hero card) imports one of these instead of hand-rolling blur/opacity.
 * Values match the brief: 24px blur, 8–12% white overlay, 8% white border,
 * 24px radius (Tailwind's `rounded-2xl` already resolves to ~24px here —
 * see `--radius-2xl` in styles/tokens.css).
 */
export const GLASS_PANEL = "backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl";

/** A slightly denser variant for surfaces that need more contrast against busy artwork (the dock, the hero card). */
export const GLASS_PANEL_STRONG = "backdrop-blur-xl bg-white/12 border border-white/10 rounded-2xl";

/** Pills and icon-only controls floating directly on the wallpaper — search bar, quick actions. */
export const GLASS_PILL = "backdrop-blur-xl bg-white/10 border border-white/10 rounded-full";
