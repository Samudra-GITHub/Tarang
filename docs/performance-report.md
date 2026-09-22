# Performance Report — R3.0

## Lighthouse (production build, `next build && next start`, headless Chrome, this environment)

| Category | Score |
|---|---|
| Performance | **70** |
| Accessibility | **100** |
| Best Practices | **96** |
| SEO | **100** |

Accessibility and SEO hit the target (100). Best Practices (96) and Performance (70) did not, for reasons below — both are explained, not hand-waved.

### Why Best Practices is 96, not 100

The single deduction is `errors-in-console`: the Trending Now feature (`features/youtube/*`) tries several public Invidious/YouTube-mirror instances in parallel, and every one is blocked by this environment's CORS policy (the mirrors have no `Access-Control-Allow-Origin` header reachable from here). The app already handles this gracefully — it falls back to an empty/error state rather than crashing — but each failed `fetch` still logs a browser console error, which Lighthouse penalizes regardless of whether the app recovers. This is an external-network characteristic of the sandbox, not an app defect; in a deployment with a working Invidious mirror (or a real backend proxy), this resolves itself.

### Why Performance is 70, not 95+

```
First Contentful Paint   1.8s   (score 0.89)
Largest Contentful Paint 5.6s   (score 0.17)  ← dominant weighted factor (25%)
Total Blocking Time      230ms  (score 0.87)
Speed Index              5.1s   (score 0.62)
Cumulative Layout Shift  0.025  (excellent)
```

Root cause, confirmed via Lighthouse's own network-RTT audit: every piece of artwork in this build — the hero image, every rail card, every song cover — is a **remote placeholder photo from `picsum.photos`/`fastly.picsum.photos`** (this is seed/demo data, not real album art; see `lib/placeholder.ts`). Each image requires a real DNS + TLS + HTTP round trip to a third-party CDN (~40–75ms RTT measured), and the hero image is `priority`-loaded, so the LCP element can't paint until that remote fetch completes. `next/image` optimization, correct `sizes`, and lazy-loading for everything *except* the hero were already correct going in (confirmed by audit — no rail image had `priority`, no hero image lacked it) — the bottleneck is the demo image source, not the optimization pipeline around it.

**This is not a code-architecture problem** — swapping `picsum.photos` URLs for real, self-hosted or CDN-served album artwork (the normal case for an actual launch) would remove this bottleneck without touching a single component. Total Blocking Time (230ms) and CLS (0.025) — the metrics that *do* reflect the app's own JS/layout work — are both good.

## Bundle observations (`next build` output)

```
+ First Load JS shared by all      102 kB
  chunks/1255-...js                46.1 kB
  chunks/4bd1b696-...js            54.2 kB
Home (/)                           14.3 kB   →  196 kB First Load
Library                            17.3 kB   →  233 kB First Load  (largest route)
Search                              8.96 kB  →  225 kB First Load
Design System (dev-only)           14.5 kB   →  195 kB First Load
Dev Tools (dev-only)                8.44 kB  →  185 kB First Load
```

No route exceeds ~233 kB First Load JS. All static-data routes (`/`, `/moods`, `/downloads`, `/settings`, `/stats`) prerender as static content; `/album/[id]`, `/artist/[id]`, `/moods/[id]`, `/playlist/[id]` are server-rendered on demand.

## Lazy-loaded modules (new in this sprint)

Three components were statically imported into every route via `AppShell` (mounted unconditionally, so their JS shipped in the initial bundle regardless of whether the user ever opened them):

- **`LyricsView`** (`features/player/now-playing-view.tsx`) — now `next/dynamic`, and genuinely deferred: it's only rendered when `showLyrics` is true, so the chunk is fetched on first use, not on page load.
- **`CreditsSheet`** (`components/layout/app-shell.tsx`) — now `next/dynamic`. Still mounted unconditionally (so its chunk loads shortly after the main bundle), but moved out of the critical path into its own async chunk.
- **`SmartDownloadsSync`** (`components/layout/app-shell.tsx`) — same treatment as CreditsSheet.

Stats charts, Settings, and the Downloads manager were already route-level code-split by Next.js's own per-page bundling (confirmed by audit — each is only imported by its own `app/*/page.tsx`) — no additional lazy-loading was needed there.

## Memoized / de-duplicated computations

- `features/home/trending-rail.tsx` — the `.map(youtubeResultToSong)` transform now runs inside `useMemo`, keyed on `results`, instead of on every render.
- `features/player/waveform-progress.tsx`'s `LineVisualizer` — the SVG `points` string only depends on `bars`, not the continuously-changing `progress` prop, but was recomputed every frame during playback. Now memoized on `bars` alone.
- `features/home/home-view.tsx` — `resolveSpotlight(continueListening[0])` operates purely on static module data (`albums`/`playlists`/`continueListening` never change at runtime) and was being recomputed inside the component body on every render. Hoisted to a module-level constant, computed once.

No `React.memo` exists anywhere in the codebase (confirmed by audit) and none was added — every Zustand store subscription already uses narrow, single-field selectors (confirmed by audit: zero whole-object selectors), so there's no unnecessary re-render pattern that `React.memo` would fix; adding it without an actual re-render problem would be premature.

## Memory leak audit

Checked every `addEventListener`/`ResizeObserver`/`IntersectionObserver`/`setInterval`/`setTimeout` in the codebase against its cleanup path. All had one **except** `features/youtube/youtube-engine.ts`'s `currentTime` poll: a 500ms `setInterval` was started once on player-ready and never stopped, ticking forever — including while paused. Fixed: the interval now starts on the `PLAYING` state and stops on `PAUSED`/`ENDED`, so it only runs while actually needed. `lib/store/player-store.ts`'s native `<audio>` element listeners have no cleanup by design (the element is a session-long singleton, documented in its own comment) — confirmed correct, not a leak.

## Remaining hotspots (honest, not exhaustive)

1. **LCP** — as explained above, dominated by the demo placeholder-image CDN, not app code. Real album artwork resolves this.
2. **Rail "virtualization"** — the app has no windowing/virtualization library, and none was added. Every rail in this app is a bounded, small list (catalog-sized, not thousands of rows), so a virtualizer would add real complexity for negligible benefit; the practical equivalent (no `priority` on off-screen images, so browsers don't eagerly fetch them) was already in place.
3. **Blur placeholders** — not implemented for hero/backdrop images. Real `blurDataURL` generation needs either build-time processing of static assets or a runtime blur-hash service; with remote, arbitrary demo-image URLs there's no static asset to pre-process. Documented rather than faked with a generic gray box.
4. **Search's external network calls** are inherently latency-bound (multiple Invidious mirror attempts) — already has a loading state, error state, and retry action; no further optimization available from the client side.
