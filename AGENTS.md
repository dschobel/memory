# AGENTS.md

## Project Snapshot
- App: Unicorn Memory Match (kid-friendly memory game + PWA support).
- Stack: plain HTML/CSS/JavaScript. No framework, bundler, package manager, or build step.
- Runtime: static files served over HTTP(S) (required for service worker behavior).

## Run Locally
```bash
python3 -m http.server 4173
```
- Open `http://localhost:4173`.

## Source Map
- `index.html`: app shell, stats header, game board container, matched gallery, settings modal.
- `app.js`: game state, deck generation/shuffle, card interactions, settings modal handlers, service worker registration.
- `styles.css`: layout, card flip/match animations, responsive rules, settings modal/button styles.
- `sw.js`: cache-first service worker and offline asset pre-cache list.
- `manifest.webmanifest`: install metadata for PWA.
- `assets/unicorns/*.svg`: card-face source images (10 unique unicorns).

## Current Game Model
- `pairCount` is the number of unique pairs in the current game.
- Total cards are configured via settings modal input (`card-count`) and normalized to even values from 4 to 20.
- `newGame()`:
1. clears timers and state
2. updates stats and matched panel
3. selects `pairCount` random unicorn assets
4. duplicates + shuffles into deck
5. renders board buttons
- Win condition: `matches === pairCount`.

## Important Couplings
- Max supported cards is derived from assets: `maxTotalCards = unicornAssets.length * 2`.
- If unicorn assets are added/removed:
1. update `unicornAssets` in `app.js`
2. update `ASSETS` cache list in `sw.js`
3. verify settings limits/defaults still make sense
- If cached files change and users need fresh assets, bump `CACHE_NAME` in `sw.js`.

## UX + Accessibility Notes
- Stats and matched panel use `aria-live`.
- Board and matched panel labels are dynamically updated for current game size.
- Keep controls usable on touch devices (iPad-first intent).

## Change Guidelines
- Prefer minimal, direct DOM updates in `app.js`; avoid introducing frameworks unless requested.
- Keep CSS responsive behavior intact (`@media (min-width: 700px)` is the main layout breakpoint).
- Preserve reduced-motion behavior in `styles.css`.

## Verification Checklist
- Syntax check:
```bash
node --check app.js
```
- Manual smoke test in browser:
1. start new game
2. open/close settings modal
3. save card counts at 4, 10, and 20
4. confirm stats goal/matched panel labels update
5. confirm matches clear cards and game can finish
