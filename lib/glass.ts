/**
 * Tarang's frosted-glass recipe — the one place "glassmorphism" is defined.
 * Every floating chrome surface (sidebar, dock, search bar, quick actions)
 * imports one of these instead of hand-rolling blur/opacity. Values match
 * the V2 cinematic spec: 30px blur, 5–8% white overlay, 8% white border,
 * 28–32px radius — soft and barely-there, not a frosted slab.
 */
export const GLASS_PANEL = "backdrop-blur-[30px] bg-white/[0.05] border border-white/[0.08] rounded-[28px]";

/** A slightly denser variant for surfaces that need more contrast against busy artwork (the dock). */
export const GLASS_PANEL_STRONG = "backdrop-blur-[30px] bg-white/[0.08] border border-white/[0.08] rounded-[28px]";

/** Pills and icon-only controls floating directly on the wallpaper — search bar, quick actions, the player dock. */
export const GLASS_PILL = "backdrop-blur-[30px] bg-white/[0.08] border border-white/[0.08] rounded-full";
