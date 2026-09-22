/**
 * Tarang's motion tokens — the only place a duration or easing curve is defined.
 * Every animated component imports from here or from `lib/motion-variants.ts`
 * instead of writing its own `transition={{ ... }}` object.
 */

/** Seconds, for Framer Motion's `transition.duration`. */
export const durations = {
  /** Toggle/press feedback — barely perceptible. */
  instant: 0.1,
  /** Hover states, chip selection, small UI feedback. */
  fast: 0.15,
  /** The default — fades, card transitions, most UI motion. */
  normal: 0.25,
  /** Section/rail entrances, drawer and sheet slides. */
  slow: 0.45,
  /** Page-defining moments — Now Playing expand, hero reveals. */
  hero: 0.7,
} as const;

export const easings = {
  /** Material-style default — most transitions that both start and end in view. */
  standard: [0.4, 0, 0.2, 1],
  /** Entrances — content already at rest, arriving. */
  decelerate: [0, 0, 0.2, 1],
  /** Exits — content at rest, leaving. */
  accelerate: [0.4, 0, 1, 1],
  /** The expressive Apple-style curve for hero reveals and page transitions. */
  emphasized: [0.22, 1, 0.36, 1],
  /** A soft, low-energy spring — switches, chips, general UI feedback. */
  springSoft: { type: "spring", stiffness: 220, damping: 26, mass: 1 },
  /** A tight, high-energy spring — button/card press-and-release micro-interactions. */
  springSnappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
  /** Tuned specifically for the mini-player ↔ Now Playing artwork expand/collapse. */
  springPlayer: { type: "spring", stiffness: 300, damping: 30, mass: 0.9 },
} as const;

export type Duration = keyof typeof durations;
export type Easing = keyof typeof easings;
