# Contributing to Tarang

Thanks for considering a contribution. Tarang is a design-system-first project — most of the value here is in the *consistency* of the system, so please read this before opening a PR.

## Getting set up

```bash
git clone <this-repo>
cd Tarang
npm install
npm run dev
```

No environment variables or backend are required — the app runs entirely on static seed data (see `data/`).

## Before opening a PR

Run the full verification gate locally — the same one used for every release in this repo:

```bash
npm run build      # production build + type check + lint
npx tsc --noEmit   # standalone type check (catches anything build's cache might mask)
npm run lint       # standalone ESLint
```

All three must pass with zero errors and zero warnings. If you're touching anything visual or interactive, also do a quick manual pass in the browser — this project has no automated test suite yet, so a live check is the only signal.

## The one rule: use the system, don't reinvent it

Tarang's entire frontend is built on five layered systems, each documented in [`docs/design-system.md`](docs/design-system.md):

1. **Tokens** (`styles/tokens.css`) — colors, radius, shadow, spacing, type scale. Never hardcode a hex value, an arbitrary `rounded-[Npx]`, or a one-off `shadow-[...]` — if the token you need doesn't exist, add it to the token layer, don't bypass it.
2. **Typography** (`components/ui/typography.tsx`) — `Display`/`Heading`/`Title`/`Body`/`Label`/`Caption`/`Mono`. Don't reach for a raw `<p className="text-sm">` when one of these fits.
3. **Components** (`components/ui/*.tsx`) — one primitive per concern (one `Button`, one `Card`, one `Icon` wrapper, …). If you need a button variant, extend `Button`; don't create a second button component.
4. **Layout** (`components/layout/*.tsx`) — `Page`/`Section`/`Grid`/`HorizontalRail`/`ScrollContainer`/etc. Every screen renders through these; don't hand-roll page spacing.
5. **Motion** (`lib/motion.ts` + `lib/motion-variants.ts`) — every animation duration/easing is one of the named tokens, and every interactive transform respects `useReducedMotion()`. No inline `transition={{ duration: 0.3 }}` — import a token.

If you're not sure whether something already exists, check [`/design-system`](app/design-system/page.tsx) (the live component playground) and [`/dev-tools`](app/dev-tools/page.tsx) (live previews of every token/motion variant) before building new UI — both run locally with `npm run dev`, neither is linked from production navigation.

## Accessibility is not optional

This project holds a 100/100 Lighthouse accessibility score — keep it there:

- Every interactive element needs a real accessible name (visible text, or `aria-label` for icon-only controls).
- Every custom (non-native) interactive element needs keyboard support: `onKeyDown` for Enter/Space at minimum.
- New focus styles should use `FOCUS_RING` from `lib/a11y.ts`, not a hand-rolled ring.
- New Framer Motion transforms should route through `useReducedMotion()`/`useMotionVariant()` (`hooks/use-reduced-motion.ts`).
- Touch targets should be at least 44×44px (use the `before:`/`after:` invisible hit-area pattern already used in `Button`/`Slider`/`Chip` if the visual size can't grow).

See [`docs/accessibility-report.md`](docs/accessibility-report.md) for the full audit and the patterns already established.

## Commit and PR conventions

- Commit messages: short, imperative, lowercase type prefix where it fits the existing history (`fix:`, `feat:`, `release:`, `docs:`) — look at `git log` for the house style before your first commit.
- Keep PRs scoped to one concern. This codebase has a history of large phase-based sprints, but individual contributions should still be reviewable in one sitting.
- If you're deferring something out of scope rather than fixing it, say so explicitly in the PR description (and in `docs/migration-status.md` if it's design-system-relevant) — this project's convention is to document known gaps honestly rather than silently drop them.
- Don't leave `TODO`/`FIXME` comments in committed code — track the follow-up in an issue or in `docs/migration-status.md` instead.

## Reporting bugs

Open an issue with: the route/screen affected, steps to reproduce, and whether it reproduces in a fresh `npm run build && npm run start` (production mode) — several past issues in this project turned out to be dev-mode-only HMR artifacts, so a production repro is the most useful signal.

## What this project is not looking for right now

- Backend/auth features — this is an intentionally frontend-only release candidate (see the README's Known Issues). A backend integration would be a significant scope change, not a small PR — open an issue to discuss first.
- New design directions — visual/UX changes should fit the existing dark-only, "no purple, no neon, shadows are neutral" system, not introduce a new one.
