"use client";

import { useGlobalShortcuts } from "@/hooks/use-global-shortcuts";

/** Mounted once, globally — wires up app-wide keyboard shortcuts and renders nothing. */
export function GlobalShortcuts() {
  useGlobalShortcuts();
  return null;
}
