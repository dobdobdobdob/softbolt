# SOFTBOLT Project Summary

**Last updated:** March 13, 2026
**Author:** David (thedobrien@gmail.com)

---

## What is SOFTBOLT?

SOFTBOLT is an independent music discovery platform built as a web app. It connects independent artists directly with listeners through a clean, transparent experience with no hidden algorithms. Revenue split is 90% artist / 10% SOFTBOLT.

## Brand Identity

- **Primary color:** Neon green (#d4fc02 for fills, #CCFF00 used in UI accents)
- **Background:** White (#fff) with black (#111) text
- **Font:** Space Mono (monospace)
- **Logo:** Hand-drawn lightning bolt with plug at bottom, thick black brush-stroke outline and neon green fill. Vector version: `softbolt-logo.svg`. Original PNG: `softbolt logo.png`.
- **Contact emails:** hello@softbolt.io (general), takedown@softbolt.io (DMCA), legal@softbolt.io (legal)

## Files

| File | Purpose |
|------|---------|
| `softbolt.html` | Main web app (all-in-one HTML with inline React/Babel) |
| `music-discovery-app.jsx` | JSX-only version of the app (kept in sync with softbolt.html) |
| `softbolt-mobile.html` | Mobile Safari compatible version (uses `type="text/plain"` + manual Babel.transform) |
| `softbolt-admin.html` | Business/admin dashboard (dark theme, login screen, stats, artist management) |
| `softbolt-logo.svg` | Vector logo (traced from PNG) |
| `softbolt logo.png` | Original logo image (1024x1024) |
| `package.json` | Basic npm config |

**Backup files** (can be deleted): `softbolt-mobile-new.html`, `softbolt-mobile-rebuilt.html`, `logo-compare.html`

## Tech Stack

- React 18 (via CDN) with Babel Standalone (in-browser JSX compilation)
- All inline — no build step, no server, just open the HTML file
- Babel console warning suppressed via `console.warn` interceptor before Babel loads
- Mobile Safari compatibility achieved with `type="text/plain"` script tags and manual `Babel.transform()` at runtime

## App Features

### For Listeners
- **Trending Charts** — ranked purely by play count, no paid placements
- **For You** — personalized recommendations with match percentages
- **Albums** — browse full albums with track listings
- **Search** — filter by genre, search by artist/track/album name
- **Playlists** — create, rename, delete custom playlists; add/remove tracks
- **Artist Pages** — full biography, discography, tour dates, support button
- **Mini Player** — persistent bottom player with play/pause, skip, progress bar, like button
- **User Account** — editable profile (name, email, avatar, subscription tier)
- **Subscription Tiers** — Free, Listener ($4.99/mo), Superfan ($9.99/mo)
- **Badges** — achievement system (First Play, Night Owl, Genre Explorer, etc.)
- **About Us / FAQ / Terms & Conditions** — accessible from Account > More links

### For Artists
- **Artist Dashboard** — stats overview, manage profile, tour dates, subscription tiers
- **Tour Date Management** — add/edit/remove tour dates (stored as a Map keyed by artist name, visible to all visitors on artist pages)
- **Preview Profile** — see how your artist page looks to listeners
- **Artist Tiers** — Free (profile + search), Rising ($9.99/mo, +analytics), Pro ($19.99/mo, +priority support)

### Admin Dashboard (`softbolt-admin.html`)
- Login screen with dark theme
- Stats cards, artist management
- Separate from the main app

## Architecture Notes

### State Management
- All state lives in `MusicDiscoveryApp` component via `useState` hooks
- Tour dates use a `Map` keyed by artist name (e.g., `"Astral Drift"` -> array of date objects)
- `signedIn` / `setSignedIn` controls authentication state
- `infoPage` state controls which info overlay is shown ("about", "faq", "terms", or null)

### Key Components
- `BoltLogo` — inline SVG component with `w`, `h`, `color` props (color controls the fill path)
- `MiniPlayer` — persistent bottom audio player
- `ArtistPage` — full artist profile with bio, tracks, albums, tour dates
- `ArtistDashboard` — artist management panel
- `AccountPage` — user profile and settings
- `InfoPageOverlay` — About Us, FAQ (accordion), Terms & Conditions
- `TabBar` — bottom navigation (Charts uses BoltLogo icon, Albums, For You, Search, Playlists)

### Mock Data
- 10 trending tracks, 5 recommendation tracks, 6 albums
- 5 detailed artist bios (Astral Drift, Mira Soleil, Lumen Code, Kai Santos, The Voidwalkers)
- Mock tour dates for Astral Drift, Mira Soleil, and Kai Santos
- Cover art from picsum.photos with seeded URLs

### Keeping Files in Sync
When making changes, update all three app files: `softbolt.html`, `music-discovery-app.jsx`, and `softbolt-mobile.html`. The admin dashboard (`softbolt-admin.html`) only shares the BoltLogo component.

## Git Status

A `.git` directory exists in the SOFTBOLT folder. The project has not been pushed to GitHub yet. To push:

```bash
cd ~/Documents/SOFTBOLT
git remote add origin https://github.com/YOUR_USERNAME/softbolt.git
git branch -M main
git push -u origin main
```

## Known Issues / Future Work

- No real backend — all data is mock/in-memory
- No actual audio playback (progress bar is simulated)
- Babel "in-browser transformer" is suppressed but ideally the app should be precompiled
- npm registry was blocked during development, preventing package installs for precompilation
- Old backup files (`softbolt-mobile-new.html`, `softbolt-mobile-rebuilt.html`) can be cleaned up
