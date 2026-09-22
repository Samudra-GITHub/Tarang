"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import type { Variant, Variants } from "framer-motion";

/**
 * The one place Tarang reads `prefers-reduced-motion`. Every motion-aware
 * component should call this instead of Framer Motion's hook directly, so
 * the "disable transforms, keep opacity only" policy stays in one place.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

const TRANSFORM_KEYS = ["x", "y", "scale", "scaleX", "scaleY", "rotate"] as const;

function stripTransforms(state: Variant): Variant {
  const next = { ...state } as Record<string, unknown>;
  for (const key of TRANSFORM_KEYS) delete next[key];
  return next as Variant;
}

/**
 * Returns `variants` unchanged, or — under `prefers-reduced-motion` — the same
 * variants with every transform (x/y/scale/rotate) stripped so only opacity
 * (and any explicit `transition`) survives. One call replaces the
 * `reducedMotion ? fallback : variants` boilerplate at every call site.
 */
export function useMotionVariant(variants: Variants): Variants {
  const reduced = useReducedMotion();
  if (!reduced) return variants;
  const stripped: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    stripped[key] = typeof value === "object" && value !== null ? stripTransforms(value) : value;
  }
  return stripped;
}
