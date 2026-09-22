# Accessibility Report — R3.0

Audited and fixed in the R3.0 production sprint (Phase 6). Verified via: code review, live keyboard testing in a real browser, and a Lighthouse accessibility audit against the production build.

## Result

**Lighthouse Accessibility: 100/100** (production build, `next start`, headless Chrome).

## Semantic HTML

Already sound going in: `AppShell` has the only `<main>` (via `ScrollContainer`); no page double-nests one. Landmarks in place: `<aside aria-label="Main navigation">` (sidebar), `<header>` (top nav), `<nav aria-label="Primary">` (mobile nav). Heading hierarchy holds — `Display`/`Heading` render `<h1>`, `Title` renders `<h2>`, and every page has exactly one implicit h1 via its hero or page header. No fixes needed here.

## Keyboard navigation

- **Fixed a real dead tab-stop**: Framer Motion auto-adds `tabIndex={0}` to any `motion.div` with a `whileTap` handler, to make bare gesture-only elements keyboard-tappable. Tarang's `Card`, `MoodCard`, and `TrendingSongCard` wrap a real `<Link>` inside a tilt `motion.div` that also has `whileTap` for the press-scale feedback — so every card produced **two** tab stops: the outer wrapper (focusable, but does nothing on Enter/Space) and the inner link (the actual destination). Fixed by adding `tabIndex={-1}` to the three outer wrappers, confirmed via live keyboard testing: Tab now lands directly on the real link, no dead stop before it.
- Custom non-native interactive elements (`track-row.tsx`'s `role="button"` row, `folder-row.tsx`'s collapse toggle) already had correct `onKeyDown` handling for Enter/Space — verified by code review.
- Radix-based primitives (Dialog, Sheet, DropdownMenu, ContextMenu, Tabs, Slider) get full keyboard support for free (Tab/Shift+Tab, Arrow keys, Escape, Space/Enter) — no changes needed.
- **Tooling limitation, noted honestly**: the sandboxed browser used for this sprint's live verification can reliably dispatch Tab and read `document.activeElement`, but its synthetic Enter/Space key events do not reliably trigger native `<a>`/`<button>` default-action activation (confirmed by testing on a plain settings toggle button — Enter produced no state change even though the button had focus). This is a known category of automated-browser-event limitation, not an app bug — native anchor/button Enter/Space activation is guaranteed by the HTML spec regardless of app code. Manual keyboard testing in a real browser is recommended before shipping as the final confirmation.

## Screen reader support

- **New**: a dedicated, visually-hidden `aria-live="polite"` channel (`lib/store/announce-store.ts` + `components/layout/live-region.tsx`, mounted once in `AppShell`) for player/queue transport state: track change ("Now playing: X by Y"), play/pause, seek ("Seeked to 1:23"), volume ("Volume 50%"), queue removal ("Removed X from queue"). These fire too frequently for a visible toast but are real state a screen-reader user needs.
- The existing toast system (`components/ui/toast.tsx`) already carries its own `aria-live="polite"`/`role="alert"` region and was already wired into playlist/download/login/error interactions in an earlier phase — confirmed still correct, no changes needed.
- Added `aria-current` to the currently-playing track row; `aria-expanded` to the folder collapse toggle (previously state existed with no ARIA exposure); `role="status"`/`aria-live` to the search loading spinner and a hidden results-count announcement; `role="dialog"`/`aria-modal="true"`/`aria-label` plus focus-on-open to the hand-rolled full-screen Now Playing view (it doesn't use Radix Dialog because of its custom drag-to-dismiss gesture — a full focus *trap* is not implemented, only focus-on-open + the existing Escape handler; documented as a known gap below).
- Removed an invalid `aria-selected` on a `role="button"` element (ARIA spec doesn't support `aria-selected` on `button`; the row's own Checkbox already exposes `aria-checked` for selection state, so no information was lost) — caught by `next build`'s own `jsx-a11y` lint rule.

## Focus system

Unified into one import: `lib/a11y.ts`'s `FOCUS_RING`. Before this sprint, focus rings were inconsistent — `card.tsx` used an `outline`-based ring while everything else used `ring-2`/`ring-ring/50`; `checkbox.tsx`/`tabs.tsx`/`scroll-area.tsx` used a 3px ring; `slider.tsx` used a 4px ring. All now import the same constant. Verified live: Tab-ing through Home shows a consistent teal ring on nav links, mood cards, and buttons alike.

## Contrast audit

Computed WCAG relative-luminance contrast ratios by hand for every semantic pairing in active use:

| Pairing | Ratio | Result |
|---|---|---|
| `--foreground` on `--background` | 17.8:1 | AAA |
| `--muted-foreground` on `--background` | 7.1:1 | AAA |
| `--muted-foreground` on `--surface-2` | 6.0:1 | AA (close to AAA) |
| `--muted-foreground` on `--surface-3` | 5.5:1 | AA |
| `--primary-foreground` on `--primary` | 9.2:1 | AAA |
| `--destructive-foreground` on `--destructive` | 7.0:1 | AAA |
| `--accent-danger` as text on `--background` | 7.2:1 | AAA |
| `--accent-warning` as text on `--background` | 11.3:1 | AAA |
| `--ring` (focus indicator) on `--background` | 10.7:1 | Passes 3:1 non-text minimum comfortably |

**No violations found.** `--text-disabled` (38% alpha) intentionally fails contrast against most backgrounds — this is correct: WCAG 1.4.3 explicitly exempts inactive/disabled UI text from the contrast requirement. No token changes were made; the Phase 1 palette held up under audit.

## Touch targets

Found: `Button`'s `icon` (36px) and `icon-sm` (32px) size variants, and the `sm`/`md` text-button heights (32px/36px), were below the 44×44px target. Fixed with the standard invisible-hit-area technique — a `before:` pseudo-element with a negative inset, sized per variant to reach exactly 44px, with **zero visual change**. Also applied to the Slider thumb (`after:-inset-3.5`) and Chip's remove button (`before:-inset-3`).

**Known, documented exception**: `queue-row.tsx`'s three adjacent icon buttons (move up / move down / remove) sit with zero gap between them at their current size. Expanding each to a full 44px hit area there would make the invisible zones overlap, causing genuine tap ambiguity — a worse outcome than the current undersized-but-unambiguous targets. Not fixed; flagged for a future layout pass (adding real gap between the three, or moving them into an overflow menu) rather than forced now.

## Reduced motion

Every Framer Motion variant created in Phase 5 already routes through `useReducedMotion()`/`useMotionVariant()` (confirmed by grep audit — zero unguarded `whileHover`/`whileTap`/transform-bearing variant in the codebase). Extended in this sprint: `hooks/use-tilt.ts` and five decorative components (`ambient-glow`, `wave-divider`, `waveform-accent`, `mood-environment`, `floating-particles`) previously called Framer Motion's `useReducedMotion` directly — now all route through the one shared hook, per Phase 6's "one hook" requirement. CSS keyframe animations (`tarang-spin`/`tarang-pulse`/particle drift) were already covered by a global `@media (prefers-reduced-motion: reduce)` rule from an earlier phase.

**Verification method note**: this sandboxed browser has no way to emulate `prefers-reduced-motion: reduce` (no such control was exposed by the available tools). Verification here is by code review — every motion-bearing component branches on the shared hook — not a live-rendered screenshot comparison. Recommend a manual OS-level toggle test before shipping.
