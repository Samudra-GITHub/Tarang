# Migration Status

A running ledger of Tarang's design-system migration across all phases. "Done" means verified (build + lint + live browser check); "Deferred" means explicitly triaged out of scope for the phase that raised it, with a reason — not forgotten.

## Phase 1 — Design Tokens: Done
Colors, spacing, radius, shadow — all in `styles/tokens.css`, exposed via Tailwind v4 `@theme inline`.

## Phase 2 — Typography: Done
Seven components in `components/ui/typography.tsx`, `forwardRef`-based for Radix `asChild` composition.

## Phase 3 — Component Library: Done
Input system, Dialog/Overlay system, Toast system, Card primitive migration, Icon wrapper, Component Playground (`/design-system`), migration audit. Locked.

## Phase 4 — Layout System: Done
Page/Section/Grid/HorizontalRail/StickyHeader/SafeArea/ScrollContainer, every screen migrated. Locked.

## Phase 5 — Motion System: Done
`lib/motion.ts` + `lib/motion-variants.ts`, one reduced-motion hook, page transitions, rail stagger, player/queue/overlay motion. Locked.

## Phase 6–10 (R3.0) — this sprint

### Fully done
- Shared focus-visible system (`lib/a11y.ts`), applied to every outlier component.
- Live-region player/queue announcer (new primitive).
- Dead keyboard tab-stop fix (Framer Motion auto-`tabIndex` on tilt wrappers).
- Touch-target fix for `Button`'s `sm`/`md`/`icon`/`icon-sm` sizes, Slider thumb, Chip remove button.
- `aria-current`/`aria-expanded`/`role="status"` gaps closed on track rows, folder rows, search loading.
- `role="dialog"`/`aria-modal`/focus-on-open for the hand-rolled Now Playing view.
- Lazy-loading for `LyricsView`, `CreditsSheet`, `SmartDownloadsSync`.
- YouTube-engine polling-interval leak fixed.
- Three memoization fixes (trending rail, waveform points, home spotlight).
- `overscroll-contain` on the shared `ScrollContainer`.
- `lib/theme-colors.ts` — consolidated hardcoded hex literals for `next/og`/canvas contexts (7 files).
- Two exact-token arbitrary-value fixes (`text-[11px]` → `text-mono`, `h-[320px]` → `h-80`).
- Dev Tools console (`/dev-tools`, not linked from navigation).
- All 5 required docs.

### Deferred — with exact scope and reason

| Item | Scope | Why deferred |
|---|---|---|
| Raw Lucide icon imports → `<Icon>` wrapper | ~120 usages across ~30 files (`now-playing-view.tsx` alone has 14, `track-row.tsx` 11, `mini-player-frame.tsx` 10) | Phase 9 (visual polish) is explicitly the lowest of this sprint's five stated priorities, behind accessibility/performance/loading-UX. A mechanical 120-call-site migration under time pressure has real regression risk (icon size/color/stroke mismatches) for a purely cosmetic win. Not started; flagged with an exact count instead of a partial, inconsistent pass. |
| Raw `<p>`/`<span>` with text-utility classes → typography components | ~30 occurrences across charts, headers, player views | Same priority reasoning as above. A few are legitimate exceptions (e.g. canvas-rendered text, which can't use React components at all); the rest weren't triaged individually. |
| Tailwind `duration-`/`ease-` utility-class audit | Not run as a fresh final pass | Scoped out from the start — see `docs/design-system.md` §7. Consistent with the Phase 3 precedent of not renaming Tailwind's own spacing/radius scale into bespoke tokens. |
| Full focus *trap* on the Now Playing view | 1 component | It's a hand-rolled full-screen view (not Radix Dialog) with a custom drag-to-dismiss gesture; a real trap needs care to not fight the drag handler. Focus-on-open + the existing Escape handler shipped; the trap itself did not, and is flagged rather than half-built. |
| `queue-row.tsx`'s three adjacent icon buttons reaching literal 44×44px | 1 component, 3 buttons | Expanding their hit areas at zero gap would make them overlap and create tap ambiguity — worse than the current state. Needs a small layout change (real gap, or an overflow menu), not a blind touch-target expansion. |
| Cross-browser testing (Safari, Firefox, Edge) | N/A | Only one browser engine is available in this environment (the sandboxed Chromium-based tool). No Safari/Firefox instance to test against. Documented, not fabricated — see `docs/r3-release-checklist.md`. |
| Blur placeholders for hero images | 3–4 images | Needs either build-time asset processing or a blur-hash service; current artwork is arbitrary remote demo URLs (`picsum.photos`) with no static asset to pre-process. |
| Download/playlist/auth "failure" UI | N/A | Checked and confirmed structurally not applicable: this build has no backend, no real network downloads (downloads are a local, synchronous state toggle — see the `MOCK_DEVICE_CAP_MB` comment in `downloads-view.tsx`), and no authentication system (`settings-view.tsx` states "Tarang has no backend"). Building fake failure-handling scaffolding for operations that cannot fail in this architecture would be dishonest busywork, not a real gap. |

### Explicit, permanent exceptions (not gaps — design decisions)
- Ambient/decorative infinite-loop animations kept off the sub-second motion tokens (see `docs/design-system.md` §5).
- A handful of one-off arbitrary CSS values that don't map to a discrete token (viewport-relative sizes, `calc()` centering offsets, a brand wordmark's letter-spacing).
- `lib/store/folders-store.ts`'s hardcoded color-swatch palette — a color *picker's* options are inherently literal color values, not a token violation.
