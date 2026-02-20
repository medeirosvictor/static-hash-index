# CLAUDE.md

## Project Overview
Static Hash Index Simulator — a React web app that visualizes static hashing concepts from database systems: hash functions, page allocation, bucket distribution, overflow handling, and hash-based search.

**Live:** https://medeirosvictor.github.io/static-hash-index

## Tech Stack
- **React 16** with hooks (useReducer, useContext, useState)
- **Vite** for bundling and dev server
- **Web Workers** (Vite native pattern) for off-main-thread simulation computation
- **react-virtualized** for rendering large datasets (List inside pages/buckets/table)
- **CSS Grid** for responsive page/bucket layout
- **SASS** (Dart Sass), source in `src/static/sass/`
- No Redux, no lodash — pure React state management

## Project Structure
```
src/
├── App.jsx                    # Root — context provider, single view
├── index.jsx                  # Entry point
├── components/
│   ├── Simulation.jsx         # Main view: form + progress bar + worker dispatch + results
│   ├── SimulationInfo.jsx     # Stats display (page count, bucket count, overflow)
│   ├── SearchForm.jsx         # Search bar with hash lookup + highlight callback
│   ├── SearchObject.jsx       # Search result display with visual path
│   ├── Table.jsx              # Virtualized word table
│   ├── PageList.jsx           # CSS Grid page layout with highlight support
│   ├── Page.jsx               # Single page (virtualized List)
│   ├── BucketList.jsx         # CSS Grid bucket layout with highlight support
│   ├── Bucket.jsx             # Single bucket (virtualized List)
│   ├── BucketOverflowList.jsx # Overflow chain container
│   ├── BucketOverflow.jsx     # Single overflow bucket (virtualized List)
│   ├── simulationWorker.js    # Web Worker: page + bucket building logic
│   ├── contexts/SimulationContext.js  # React Context
│   ├── helpers/Helpers.js     # Hash functions (single source of truth), shuffle, file reader
│   ├── helpers/InitState.js   # Default state shape
│   └── reducers/simulationDataReducer.js  # Custom deepMerge reducer (no lodash)
├── static/
│   └── sass/index.scss        # SASS source (responsive, tooltips, highlights, progress bar)
public/
├── words.json                 # ~466K words with hash IDs (~17MB)
├── favicon.ico
index.html                     # HTML shell (Vite root)
vite.config.js                 # Vite config with React plugin, base path for GH Pages
```

## Commands
- `npm install` — install dependencies
- `npm start` — run dev server (Vite, port 3000)
- `npm run build` — production build (output: `dist/`)
- `npm run deploy` — build + deploy to GitHub Pages (master branch)

## Key Concepts
- **Two-level hashing**: word → 32-bit hashCode → bucket ID via `key % 11`
- **Pages**: fixed-size blocks holding tuples (word + ID), randomly distributed
- **Buckets**: hold (pageId, tupleId) pointers; overflow when full
- **Overflow buckets**: chained to main bucket when capacity exceeded
- **Search**: hash word → find bucket → find page pointer → display result with visual path
- **Web Worker**: all simulation building runs off-main-thread via Vite native worker pattern

## State Shape
Managed via `useReducer` + React Context:
```js
{
  meta: { pageSize, pageAmount, bucketAmount, bucketIds[], bucketSize,
          simulationStatus, hashFunction, collisionRate, overflowRate,
          totalCollisionAmount, totalOverflowAmount },
  table: { meta: { rowCount, columns }, content: [{id, word}...] },
  pageList: [ [{id, word}...], ... ],
  bucketList: { [bucketId]: { hashTable: [{pageId, tupleId}...], overflowBuckets: [...] }, ... }
}
```

## Data Flow
1. User sets page amount or page size → submits form
2. `Simulation.jsx` fetches `words.json` with streaming progress bar
3. Data + config sent to Web Worker via `postMessage`
4. Worker builds pages (random distribution) and buckets (hash allocation with overflow chaining)
5. Worker posts results back → dispatched to reducer → UI renders
6. User searches words → `SearchForm.jsx` hashes and looks up bucket → shows result with visual path → highlights matching bucket/page in grid

## UI Features
- **Progress bar**: Streaming download progress for words.json, indeterminate bar during simulation build
- **Search highlighting**: Found bucket and page get amber glow/border; matching tuples highlighted; auto-scrolls to match
- **Search path visualization**: Shows `word → hash → Bucket N → Page N` step chain
- **Tooltips**: Hover ⓘ icons on Pages, Buckets, Table, Stats, and form options for explanations
- **Responsive layout**: CSS Grid with `auto-fill, minmax(200px, 1fr)` for pages and buckets
- **Paginated grids**: Pages and buckets render 50 at a time with "Show More" buttons
- **Error handling**: User-visible error messages for failed loads and invalid input

## Feedback
- `feedback/agent-user-feedback.md` — Full improvement history and remaining nice-to-haves

## Notes
- Dataset is ~466K English words, pre-hashed in words.json (~17MB)
- Hash functions: `hashFunctionWord` (Java hashCode-style 32-bit) and `hashFunction` (mod 11)
- mod 11 chosen to produce meaningful collisions/overflow — demonstrates real hash index behavior
- Single source of truth for hash functions in `helpers/Helpers.js` (worker keeps own copy due to worker isolation)
- Worker uses Fisher-Yates shuffle + slice for O(n) page building (not O(n²) splice)
- bucketList is a compact object `{bucketId: bucket}` (not a sparse array) for efficient serialization
- Reducer uses custom `deepMerge` — returns new object, never mutates state
- Deploy goes to `gh-pages` branch via `gh-pages -d dist -b gh-pages`
