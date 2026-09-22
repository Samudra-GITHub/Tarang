import type { Variants } from "framer-motion";
import { durations, easings } from "@/lib/motion";

/**
 * Every shared Framer Motion variant in Tarang. Components import these
 * instead of writing their own `initial`/`animate`/`exit` objects, so the
 * app's motion language stays in one place. Pair with `useReducedMotion()`
 * (see `hooks/use-reduced-motion.ts`) — every variant here animates opacity
 * regardless, so reduced-motion callers can drop the transform fields and
 * still get a correct, calmer transition.
 */

/** A plain fade — the default for anything with no directional origin. */
export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: durations.normal, ease: easings.standard } },
  exit: { opacity: 0, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** Content arriving from below — cards, list rows, section reveals. */
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.decelerate },
  },
  exit: { opacity: 0, y: 8, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** Content arriving from above — dropdowns, tooltips, notices. */
export const fadeDown: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.decelerate },
  },
  exit: { opacity: 0, y: -8, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** A gentle scale-in — dialogs, popovers, the song popup. */
export const fadeScale: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.emphasized },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: durations.fast, ease: easings.accelerate },
  },
};

/** A single card entering a grid or rail. */
export const cardEnter: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.decelerate },
  },
};

/** A page section fading/sliding into view as it's scrolled to. */
export const sectionEnter: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easings.emphasized } },
};

/** The whole-page transition between routes — fade with the barest lift, nothing flashy. */
export const pageEnter: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easings.standard } },
  exit: { opacity: 0, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** A side drawer (Queue) sliding in from its edge. */
export const drawerEnter: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: durations.slow, ease: easings.emphasized } },
  exit: { opacity: 0, x: 16, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** A bottom sheet rising into place (Credits, Song Popup on mobile). */
export const sheetEnter: Variants = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easings.emphasized } },
  exit: { opacity: 0, y: 16, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** A centered modal (Dialog) — same shape as fadeScale, named for call-site clarity. */
export const modalEnter: Variants = fadeScale;

/** A toast rising and settling into the queue. */
export const toastEnter: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.emphasized },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** The mini-player artwork expanding into — or collapsing back from — Now Playing. */
export const playerExpand: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1, transition: { ...easings.springPlayer } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** A row entering the Queue list. */
export const queueSlide: Variants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: { duration: durations.fast, ease: easings.decelerate } },
  exit: { opacity: 0, x: -12, transition: { duration: durations.fast, ease: easings.accelerate } },
};

/** A single card inside a HorizontalRail, used with `railContainer`'s stagger. */
export const railItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easings.decelerate } },
};

/** The rail's own wrapper — staggers `railItem` children as the rail enters view. */
export const railContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
};
