# Tarang Design System

A reference for every layer of Tarang's design system, built across Phases 1–5 and hardened in the R3.0 production sprint (Phases 6–10). This is a map of what exists and where — not a tutorial.

## 1. Tokens (`styles/tokens.css`)

Dark-only palette. Raw hex/rgb values live only in `:root`; everything else is a semantic alias exposed as a real Tailwind utility via `@theme inline` (`bg-surface-0`, `text-text-primary`, `shadow-artwork-lg`, ...).

- **Surfaces**: `surface-0` … `surface-3` (elevation ladder) plus named shortcuts (`surface-overlay`, `surface-modal`, `surface-player`, `surface-card`).
- **Text**: `text-primary` → `text-disabled`, a full emphasis ladder.
- **Brand accents**: one teal hue (`accent-ocean`/`accent-cyan`), one coral (`accent-coral`), plus functional `accent-success`/`accent-warning`/`accent-danger`. No purple, no neon, no gradients beyond album art.
- **Radius**: `radius-sm` → `radius-full`, all derived from a single `--radius` base.
- **Shadow**: `shadow-artwork-md`/`shadow-artwork-lg` — neutral black elevation only, never colored, never glow.
- **Spacing**: Tailwind's own numeric scale is the spacing token scale; `--spacing-player`/`--spacing-player-md` are the one named off-scale constant (mini player height).
- **Typography scale**: `--text-display` → `--text-mono`, each paired with a matching line-height, auto-generating a `text-*` Tailwind utility (Tailwind v4 `@theme` convention).

**Contrast**: audited by hand in the R3.0 sprint (see `docs/accessibility-report.md`) — every semantic text/background pairing in active use clears WCAG AA (most clear AAA). No token changes were needed; the Phase 1 palette was already conservative.

## 2. Typography (`components/ui/typography.tsx`)

Seven components, each a fixed size/weight/tag pairing: `Display` (h1, hero), `Heading` (h1, page title), `Title` (h2, section), `Body` (p), `Label` (span, uppercase eyebrow), `Caption` (span, metadata), `Mono` (span, tabular numerals for timecodes). All polymorphic via `as`, all `forwardRef` (required for Radix `asChild` composition in Dialog/Sheet titles).

## 3. Components (`components/ui/*.tsx`)

One primitive per concern — Button (5 variants × 6 sizes, icon slots, loading state, `asChild`), Card (tilt+hover wrapper + Artwork/Body/Title/Subtitle slots), Chip, Switch, Slider, Dialog/Sheet/BottomSheet/Drawer (Radix, shared CSS animate-in/out), DropdownMenu/ContextMenu/Popover/Tooltip, Toast (queued, `aria-live`), the full Input family (Input/SearchInput/PasswordInput/OTPInput/TextArea), Icon (the one Lucide wrapper — stroke width and size/tone tokens fixed), Spinner/LinearProgress/CircularProgress (no shimmer, by design).

Live examples: [`/design-system`](../app/design-system/page.tsx) (developer-only, not linked from navigation).

## 4. Layout primitives (`components/layout/*.tsx`)

`Page`/`PageContainer`/`PageHeader`, `Section`/`SectionHeader`/`SectionTitle`/`SectionDescription`/`SectionContent`, `Grid` (4 presets), `HorizontalRail` (the one scrolling-row component, now with `railContainer`/`railItem` stagger-on-view), `StickyHeader`, `SafeArea`, `ScrollContainer` (now with `overscroll-contain`). Every screen renders through these; no page has its own ad hoc spacing wrapper.

## 5. Motion (`lib/motion.ts` + `lib/motion-variants.ts`)

- **Tokens**: `durations` (instant/fast/normal/slow/hero) and `easings` (standard/decelerate/accelerate/emphasized/springSoft/springSnappy/springPlayer) — the only place a duration or curve is defined.
- **Variants**: 14 shared `Variants` objects (`fade`, `fadeUp`, `fadeDown`, `fadeScale`, `cardEnter`, `sectionEnter`, `pageEnter`, `drawerEnter`, `sheetEnter`, `modalEnter`, `toastEnter`, `playerExpand`, `queueSlide`, `railItem`) plus `railContainer` for stagger.
- **Reduced motion**: one hook, `hooks/use-reduced-motion.ts` — `useReducedMotion()` (boolean) and `useMotionVariant()` (strips `x`/`y`/`scale`/`scaleX`/`scaleY`/`rotate` from any `Variants` object, keeping opacity and explicit transitions). Every Framer-Motion-driven interaction in the app reads from this hook; decorative CSS keyframe animations (`tarang-spin`, `tarang-pulse`, ambient particles) are separately gated by a global `@media (prefers-reduced-motion: reduce)` rule in `app/globals.css`.
- **Deliberate exception**: ambient/decorative infinite-loop animations (`components/decorative/*`, `components/tracks/playing-indicator.tsx`, `empty-state.tsx`'s floating icon) keep bespoke long durations (3s–21s) rather than the sub-second UI tokens — they're generative background texture, not interaction feedback, so forcing them onto `durations.*` would be semantically wrong. Same reasoning as the Tailwind-spacing exception below.

## 6. Accessibility primitives (new in R3.0)

- **`lib/a11y.ts`** — `FOCUS_RING`, the one focus-visible ring recipe (`outline-none focus-visible:ring-2 focus-visible:ring-ring/50`), imported everywhere a component previously hand-rolled its own ring width/color.
- **`lib/store/announce-store.ts` + `components/layout/live-region.tsx`** — a quiet, visually-hidden `aria-live="polite"` channel for player/queue transport state (play/pause, track change, seek, volume, queue add/remove) — too frequent for a visible toast, but real state changes screen-reader users need to hear. Distinct from the toast system, which already carries its own `aria-live` region for discrete events (added-to-playlist, download complete, errors).
- **Touch targets**: `Button`'s `sm`/`md`/`icon`/`icon-sm` size variants now carry an invisible `before:`-pseudo-element hit-area expansion reaching 44×44px without changing any visual size — a standard, no-redesign accessibility technique.

## 7. Known, documented scope exclusions

These are deliberate calls, not oversights — each is explained where it was made:

- Tailwind `duration-`/`ease-` **utility classes** on non-Framer-Motion elements are out of scope for `lib/motion.ts` (a JS token file), the same way Tailwind's own spacing/radius scale was never renamed into a bespoke token file in Phase 1.
- A handful of one-off arbitrary pixel values (hero section heights, `calc()`-based centering offsets, sub-pixel waveform bar widths, a wordmark's letter-spacing) don't map to a discrete token and are legitimately bespoke.
- `next/og` image generators and `<canvas>` 2D drawing can't consume CSS custom properties — their color literals are centralized in `lib/theme-colors.ts` instead, kept in sync with `styles/tokens.css` by hand.
- The full raw-Lucide-icon-import migration to the `Icon` wrapper (~120 usages across ~30 files) and the raw `<p>`/`<span>` → typography-component migration (~30 occurrences) were triaged as lower priority than accessibility/performance/loading-UX in this sprint and are only partially done — see `docs/migration-status.md` for the exact remaining count.
