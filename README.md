# Tarang

**Music, redesigned for the web.**

Tarang is a premium music streaming web app built around motion, glass surfaces, and a listening experience that feels closer to a physical object than a browser tab.

<br/>

<img src="./assets/hero.png" width="100%" alt="Tarang hero" />

<br/>

## Live Demo

Not yet deployed — run it locally for now (see [Setup](#setup)).

<br/>

## Overview

Tarang isn't a Spotify clone. It's an exploration of what a music player feels like when glassmorphism, motion design, and a real design system are treated as first-class product decisions instead of decoration.

The app currently runs entirely on static seed data — no backend, no account system, no environment variables. Every screen you can reach today is real, shipped UI, not a mockup.

<br/>

## What's Available Now

- Free music playback
- Premium glassmorphism interface
- Redesigned homepage
- Floating, persistent music player
- Responsive layout across breakpoints
- Smooth, systemized page and state transitions
- Library, search, stats, moods, and downloads surfaces
- A dedicated in-app design system reference (`/design-system`)

<br/>

## Coming Soon

- Playlists
- Lyrics
- Queue management
- AI-powered recommendations
- Favorites
- Offline downloads

<br/>

## Screenshots

<table width="100%">
<tr>
<td width="50%"><img src="./assets/screenshots/home.png" width="100%" alt="Home" /><br/><sub align="center">Home</sub></td>
<td width="50%"><img src="./assets/screenshots/dashboard.png" width="100%" alt="Library dashboard" /><br/><sub align="center">Library</sub></td>
</tr>
<tr>
<td width="50%"><img src="./assets/screenshots/mobile.png" width="100%" alt="Mobile layout" /><br/><sub align="center">Mobile</sub></td>
<td width="50%"><img src="./assets/screenshots/feature-1.png" width="100%" alt="Floating player" /><br/><sub align="center">Floating player</sub></td>
</tr>
</table>

<br/>

## Features

| Feature | Description |
|:--|:--|
| Floating player | A persistent, glass-surfaced player that survives navigation and never blocks content |
| Design system | A living `/design-system` route documenting tokens, motion, and components in-app |
| Moods | Curated listening states rather than flat genre tags |
| Stats | A dedicated surface for listening activity |
| Dev tools | An internal `/dev-tools` route for inspecting design-system state during development |

<br/>

## UI Philosophy

Tarang treats the interface as the instrument, not the wrapper around one. Every surface uses restrained glass panels, soft depth, and a monochrome-first palette so that album art and typography — not chrome — carry the visual weight.

<br/>

## Motion System

Motion in Tarang is systemized, not sprinkled in. Shared variants live in `lib/motion.ts` and `lib/motion-variants.ts`, and are reused across every route so that a transition feels the same whether you're opening an album, a playlist, or a settings panel. Framer Motion drives all of it.

<br/>

## Folder Structure

```
tarang/
├── app/                  # Next.js App Router routes
│   ├── album/
│   ├── artist/
│   ├── design-system/    # Live design-system reference
│   ├── dev-tools/
│   ├── downloads/
│   ├── library/
│   ├── moods/
│   ├── playlist/
│   ├── search/
│   ├── settings/
│   └── stats/
├── components/
│   ├── cards/
│   ├── charts/
│   ├── collection/
│   ├── decorative/
│   ├── layout/
│   ├── tracks/
│   └── ui/
├── features/             # Feature-scoped logic, mirrors app/ routes
├── lib/                  # Motion variants, glass tokens, formatting, stats
├── data/                 # Static seed data (no backend yet)
├── docs/                 # Design-system, accessibility, and release reports
└── styles/
```

<br/>

## Tech Stack

`Next.js 15` · `React 19` · `TypeScript` · `Tailwind CSS 4` · `Framer Motion` · `Zustand` · `Radix UI` · `shadcn/ui`

<br/>

## Setup

```bash
git clone https://github.com/Samudra-GITHub/Tarang.git
cd Tarang
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

<br/>

## Environment Variables

None required. Tarang currently runs entirely on static seed data in `data/` — no API keys, database, or auth provider needed to run it locally.

<br/>

## Roadmap

- [x] Glassmorphism UI and redesigned homepage
- [x] Floating player and responsive layout
- [x] Library, search, stats, and moods surfaces
- [ ] Playlists
- [ ] Lyrics
- [ ] Queue management
- [ ] AI-powered recommendations
- [ ] Favorites
- [ ] Offline downloads

<br/>

## License

MIT — see [LICENSE](./LICENSE).

<br/>

<sub>Part of the Samudra OS product ecosystem. See the [profile](https://github.com/Samudra-GITHub) for the full lineup.</sub>
