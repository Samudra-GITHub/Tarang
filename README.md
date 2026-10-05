<div align="center">

# Tarang (तरङ्ग)

**A music-first streaming web app with a glass interface and one shared motion language.**

Floating player · synced lyrics · queue · playlists · moods · stats · simulated offline downloads

<br />

**[Overview](#overview)** &nbsp;·&nbsp; **[Features](#features)** &nbsp;·&nbsp; **[Getting started](#getting-started)** &nbsp;·&nbsp; **[Architecture](#architecture)** &nbsp;·&nbsp; **[Structure](#project-structure)**

<br />

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-state-433e38?style=flat-square&logo=react&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## Overview

Tarang is not a Spotify clone. It explores what a streaming app feels like when glass surfaces, shared motion variants and a documented design system are first-class. The interface is the instrument: restrained panels, soft depth and a monochrome-first palette so album art and typography carry the weight.

There is no backend, account system or required environment variable. The catalog is seed data in `data/`, user state is kept in the browser, and search and trending use public YouTube-backed services.

## Features

- **Persistent mini player** and a full now-playing view with queue drawer, synced lyrics view, translations, credits sheet and a waveform progress bar
- **Playback** through a native `<audio>` element for seed tracks and the YouTube IFrame Player API for YouTube results
- **Library** with user playlists, folders, drag-and-drop playlist cards, a recently-added timeline and add-to-playlist dialogs
- **Search** across the catalog and YouTube (via public Invidious instances, with caching and fallback), plus a trending rail
- **Moods**: curated listening states with their own environments
- **Stats**: a listening journey and charts, plus **pins** and listening history
- **Downloads** (simulated): quality tiers, a storage estimate, smart downloads and offline mode, backed by `localStorage`
- **Design system reference** at `/design-system` and an internal `/dev-tools` page
- **Accessibility**: reduced-motion support, live-region announcements, global keyboard shortcuts, and an accessibility report in `docs/`
- **PWA basics**: web manifest, generated icons and Open Graph image, sitemap and robots

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, design tokens in `styles/tokens.css`, shadcn/ui, Radix UI |
| Motion | Framer Motion with shared variants (`lib/motion.ts`, `lib/motion-variants.ts`) |
| State | Zustand (with `persist`) |
| Playback / search | HTML audio, YouTube IFrame Player API, Invidious API |

## Project Structure

```
Tarang/
├── app/                 # Routes: album, artist, playlist, library, search, moods,
│                        #   downloads, stats, settings, design-system, dev-tools
├── components/          # cards, charts, collection, decorative, layout, tracks, ui
├── features/            # Feature modules: home, player, library, search, moods,
│                        #   stats, downloads, settings, youtube, ...
├── hooks/               # Reduced motion, shortcuts, online status, dominant colour, tilt
├── lib/                 # Motion, glass tokens, formatting, search, stats
│   └── store/           # Zustand stores (player, library, downloads, settings, ...)
├── data/                # Seed songs, albums, artists, playlists, moods, lyrics
├── styles/tokens.css    # Design tokens
├── docs/                # Design system, accessibility, performance and release reports
```

## Getting Started

Requires Node.js and npm.

```bash
git clone https://github.com/Samudra-GITHub/Tarang.git
cd Tarang
npm install
npm run dev          # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Configuration

Nothing is required to run locally. Optionally set `NEXT_PUBLIC_SITE_URL` to the deployed origin so metadata, sitemap and robots use the right URL (it defaults to `http://localhost:3000`).

## Architecture

- **Player store as the hub.** `lib/store/player-store.ts` owns playback state. It bridges events from both the native audio element and the YouTube IFrame wrapper (`features/youtube/youtube-engine.ts`) so the UI is engine-agnostic.
- **Feature-scoped modules.** Route files in `app/` stay thin and render views from `features/`.
- **Design system first.** Tokens, typography, layout primitives and motion variants are shared across every route, and documented in [docs/design-system.md](docs/design-system.md).
- **Persisted client state.** Library, downloads and settings persist to `localStorage`.

Known constraints:

- Search relies on community-run public Invidious instances, which can go offline. The list is in `features/youtube/invidious-client.ts`.
- Artwork comes from `picsum.photos` and demo audio is placeholder content.

Further reading: [design system](docs/design-system.md), [accessibility report](docs/accessibility-report.md), [performance report](docs/performance-report.md), [v3 release report](docs/v3-release-report.md).

## Deployment

No deployment configuration is included. It is a standard Next.js app (`npm run build`, then `npm run start`).

## Future Improvements

- Real offline downloads (currently simulated)
- A catalog and playback backend
- AI-powered recommendations
- Replace the demo artwork and add real screenshots to this README

## License

MIT, see [LICENSE](LICENSE).
