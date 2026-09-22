# Changelog

All notable changes to Tarang are documented in this file.

## v3.0.0 — Release Candidate

Tarang v3.0.0 is the first production-ready release of Tarang's frontend architecture.

### Highlights

- Complete Design System
- Semantic Typography
- Component Library
- Layout Primitives
- Cinematic Motion System
- Accessibility-first UI
- Performance Optimizations
- Loading, Empty & Error States
- Developer QA Console
- Documentation Suite

### What's New

#### Design System
- Semantic color tokens.
- Radius tokens.
- Elevation tokens.
- Typography scale.

#### Motion
- Shared animation variants.
- Shared element player transitions.
- Reduced motion support.

#### Accessibility
- Keyboard navigation.
- Screen reader support.
- ARIA labels.
- Focus management.
- WCAG AA improvements.

#### Performance
- Lazy loading.
- Bundle splitting.
- Memoization.
- **Timer cleanup** — fixed interval polling cleanup in `features/youtube/youtube-engine.ts` to prevent polling from continuing after playback is paused.

#### Documentation
- Design System
- Accessibility Report
- Performance Report
- Migration Status
- Release Checklist

### Known Issues

- Placeholder artwork assets still use demo images.
- **No backend or authentication system is included in this release.** Tarang v3.0.0 is a frontend-only release candidate. The "Sign out" action currently resets locally stored user preferences and display name only.

### Release Status

🟡 Release Candidate — Frontend production-ready.
