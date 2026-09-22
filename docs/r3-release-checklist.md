# Tarang R3.0 — Release Candidate Checklist

## Required verification (mandatory gate)

| Check | Result |
|---|---|
| `npm run build` | **PASS** — clean production build, 21 routes, no errors |
| TypeScript (`tsc` via build) | **PASS** — no type errors |
| ESLint (via build) | **PASS** — no warnings or errors |
| Runtime verification | **PASS** — live-browser-tested across Home, Search, Library, Artist, Album (via header), Moods, Downloads, Stats, Settings, Now Playing, Queue, Dev Tools; zero new console errors on any route (only the pre-existing, expected Invidious/YouTube-mirror CORS errors from Trending Now) |
| Accessibility verification | **PASS** — Lighthouse Accessibility **100/100** on the production build; live keyboard-navigation test confirmed consistent focus rings and found + fixed a real dead tab-stop bug |
| Responsive verification | **PASS** — tested 360px, 390px, tablet (768px), and desktop; no overflow, no clipped UI, no broken grids at any of them |
| Performance verification | **PARTIAL** — Lighthouse Performance **70/100** (target 95+ not met). Root cause identified and documented (remote demo placeholder images dominate LCP — see `docs/performance-report.md`), not an app-architecture problem |

## Cross-page audit

Home, Search, Library, Artist, Album, Playlist, Moods, Downloads, Stats, Settings, Now Playing, Queue, Design System, and the new Dev Tools page were all opened and screenshotted live in this sprint. Lyrics and Credits were code-reviewed (both now lazy-loaded) but not opened live in this pass — no code path affecting them changed beyond the `next/dynamic` wrapping, which is a well-understood, low-risk transformation.

## Functional regression audit

- **Playback**: verified live via the new Dev Tools audio tester — load queue, play/pause, next/previous, seek, volume all confirmed against the real player store and reflected correctly in the mini player and Stats page (play count incremented from 0 to 6 during testing).
- **Queue**: verified live — add-next, add-to-play-later, remove (with exit animation), reorder all functional; queue-length counter updated correctly.
- **Search**: verified — genre browsing renders; the external search itself depends on Invidious mirrors that are blocked in this sandbox (pre-existing, documented, gracefully handled with a Retry action).
- **Moods, Downloads, Playlists, History, Stats**: all opened live, rendered correctly, no console errors.
- **Login / signup**: **not applicable**. This build has no backend and no authentication system (`settings-view.tsx`'s own copy: "Saved on this device — Tarang has no backend"). Not tested because there is nothing to test.

## Responsive audit

| Breakpoint | Result |
|---|---|
| 360px | Clean — Home, no overflow, bottom nav correct |
| 390px | Clean — Library, no overflow |
| 430px | Not separately captured; 390px and tablet bracket it with no issues found at either, low risk |
| Tablet (768px) | Clean — Artist page, sidebar + content layout correct |
| Desktop | Clean — baseline for all other testing in this sprint |

## Browser audit

**Chrome/Chromium-based**: fully tested (this sprint's only available browser engine).
**Edge, Safari, Firefox**: **not tested — no instance available in this environment.** Not fabricated. Risk assessment instead: the app uses Tailwind v4, Radix UI primitives, and Framer Motion, all broadly cross-browser-supported. The one previously-identified Safari-specific risk (`backdrop-filter` glassmorphism) was already removed in Phase 3. `scrollbar-width`/`scrollbar-color` (used for the app's thin-scrollbar styling) is unsupported in Safari <18 but degrades gracefully to default scrollbars — no functional break. Recommend a manual pass in real Safari/Firefox/Edge before shipping.

## Lighthouse audit

| Category | Score | Target | Met? |
|---|---|---|---|
| Performance | 70 | 95+ | No — see `docs/performance-report.md` for root cause (demo placeholder-image CDN latency, not app code) |
| Accessibility | 100 | 100 | **Yes** |
| Best Practices | 96 | 100 | No — one deduction, from console errors caused by blocked third-party Invidious mirrors (external network dependency, gracefully handled by the app) |
| SEO | 100 | 100 | **Yes** |

## Developer QA Console

Built at `/dev-tools` (`features/dev-tools/dev-tools-view.tsx`), not linked from any navigation (`lib/nav-items.ts` unchanged). Live controls verified: theme/typography/spacing/radius/elevation swatches, a motion-variant player with a reduced-motion preview toggle, a safe-area inset slider (illustrative demo, not a global override of the real `SafeArea` component), a live breakpoint readout, toast tester (all 4 variants), a live-region announcer tester, a real Dialog and BottomSheet tester, and an audio/queue tester that drives the actual player store — confirmed live to affect the real mini player and Stats history.

## Documentation created

- `docs/design-system.md`
- `docs/accessibility-report.md`
- `docs/performance-report.md`
- `docs/migration-status.md`
- `docs/r3-release-checklist.md` (this file)

## Release readiness verdict

**Conditional GO.** Accessibility, functional correctness, and responsive behavior are launch-ready and verified. Performance is the one real blocker against the stated 95+ target, and it is a data/asset problem (placeholder images from a third-party demo CDN), not a code-architecture problem — swapping in real, production album artwork before launch should close most of the gap without further engineering work. Recommend: (1) confirm performance numbers against real artwork before final sign-off, (2) a manual pass in real Safari/Firefox/Edge, (3) a manual OS-level reduced-motion toggle test, given this environment's tooling couldn't emulate either.
