# Agent-User Feedback — Static Hash Index Simulator

## Critical Analysis (Historical — all issues resolved)

The project was originally a broken Express+CRA prototype. All architectural and runtime issues have been fixed through 4 phases of improvement.

---

## Phase 1 — Make It Run ✅ COMPLETE

| Task | Status |
|---|---|
| Remove Express backend | ✅ Deleted `index.js`, `helpers.js`, `initialState.js`, server deps |
| Move `words.json` to `public/` | ✅ Fetched as static asset |
| Replace CRA with Vite | ✅ `vite.config.js` with React plugin, base path for GitHub Pages |
| Replace node-sass/gulp with Dart Sass | ✅ SCSS imported directly, Vite handles compilation |
| Remove `@reach/router` | ✅ Single-page app, no router needed |
| Fix fetch call | ✅ Uses `import.meta.env.BASE_URL + 'words.json'` |
| Remove unused root files | ✅ `words.txt`, `yarn.lock`, server files deleted |
| Flatten `client/` to root | ✅ No subdirectory |
| Remove unused dependencies | ✅ `lodash`, `express`, `node-sass`, `gulp`, `concurrently`, `password-generator`, etc. all removed |

## Phase 2 — Fix Bugs ✅ COMPLETE

| Task | Status |
|---|---|
| Fix reducer mutation | ✅ Custom `deepMerge` function returns new object (lodash removed entirely) |
| Fix stale closure in buildSimulation | ✅ Passes `currentState` snapshot to worker, uses worker result directly |
| Fix SearchForm recursion | ✅ Uses `useRef` for retry count |
| Add error handling to fetch | ✅ `.catch()` with user-visible error state |
| Add input validation | ✅ `isNaN`/`<= 0` check + `min="1"` HTML attribute |

## Phase 3 — Modernize & Deploy ✅ COMPLETE

| Task | Status |
|---|---|
| Migrate Web Worker to Vite pattern | ✅ `new Worker(new URL(...))` — removed `workerSetup.js` blob URL hack |
| Deduplicate hash functions | ✅ Single source in `helpers/Helpers.js`, imported by SearchForm. Worker keeps its own copy (required — workers can't import from main thread in all browsers) |
| Fix package.json name | ✅ `"static-hash-index-simulator"` |
| Fix InitState hash description | ✅ `"H(k) = \|k\| mod 466997"` |
| Fix Helpers.js hash function | ✅ Was `% 11`, now `% 466997` |
| GitHub Pages deployment | ✅ `gh-pages -d dist -b master`, base path configured in Vite |
| Fix data loss in overflow | ✅ Added missing `else` branch when all overflow buckets full |
| Remove dead code | ✅ `workerSetup.js`, `loading.gif`, unused Helpers functions cleaned up |
| Fix Math.random keys | ✅ BucketOverflowList uses stable index-based keys |

## Phase 4 — Polish ✅ COMPLETE

| Task | Status |
|---|---|
| Loading progress bar for words.json | ✅ Streaming fetch with `ReadableStream` progress tracking + indeterminate bar for build phase |
| Highlight search path visually | ✅ Search highlights matching bucket and page with amber border/glow. Hash tuples highlighted with left border accent |
| Search path visualization | ✅ Shows `word → hash → Bucket N → Page N` step-by-step in SearchObject |
| Make page/bucket layout responsive | ✅ Replaced `react-virtualized` Collection (hardcoded 1000px) with CSS Grid (`auto-fill, minmax(200px, 1fr)`) for pages and buckets |
| Add explanation tooltips | ✅ Tooltips on Pages, Buckets, Word Table, Simulation Stats, and Page Settings form options |
| Responsive simulation status | ✅ Flex layout with mobile breakpoint |
| UI modernization | ✅ Replaced hotpink panel with dark slate gradient, rounded corners, consistent color scheme, proper focus states on inputs |

---

## Current Architecture

- **No server** — fully static client-side app
- **Vite** for dev/build, Dart Sass for styles
- **React 16** with `useReducer` + `useContext` (no Redux, no lodash)
- **react-virtualized** `List` for large scrollable content within pages/buckets/table
- **CSS Grid** for page/bucket grid layout (responsive)
- **Web Worker** (Vite native) for off-main-thread simulation building
- **gh-pages** deploys to master branch

## Remaining Nice-to-haves (not blocking)

- Upgrade React 16 → 18 (would enable concurrent features, but not required)
- Replace react-virtualized with lighter alternative (e.g. react-window) — react-virtualized is large but functional
- Compress/split words.json (17MB) — could lazy-load or use gzip at CDN level
- Dark mode toggle
