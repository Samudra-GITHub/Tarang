# GitHub assets

This folder holds the images the root [`README.md`](../../README.md) embeds.

## Current state: placeholders

`screenshot-home.svg`, `screenshot-now-playing.svg`, and `screenshot-library.svg` are **generated SVG placeholders**, not real product screenshots — they're here so the README renders correctly on GitHub before real captures exist. Same situation as the app's own `picsum.photos` demo artwork (see the root README's Known Issues): intentional, temporary, and clearly marked.

## Replacing them with real screenshots

1. Run the app: `npm run dev` (or `npm run build && npm run start` for a production-accurate capture).
2. Capture at **1200×750** (or any consistent 16:10-ish ratio) for these three views:
   - `screenshot-home.png` — the Home screen with the hero spotlight and a rail or two visible.
   - `screenshot-now-playing.png` — the expanded full-player view with a track loaded.
   - `screenshot-library.png` — the Library screen, ideally with at least one playlist/liked song visible so it doesn't look empty.
3. Save them into this folder using the `.png` filenames above.
4. Update the three image paths in the root `README.md` from `.svg` back to `.png` (two spots: the hero image and the screenshot table).
5. Delete the `.svg` placeholders once they're no longer referenced anywhere.

Keep file sizes reasonable (a few hundred KB each) — GitHub renders README images at whatever size you request, so there's no need for anything larger than ~1600px on the long edge.
