# Static Hash Index Simulator

A web-based simulator that visualizes how databases and operating systems organize data using **static hashing**. It demonstrates the relationship between hash tables, pages, and buckets — core concepts in database indexing — through an interactive UI where you can configure page layouts, watch bucket allocation, and search for words to see exactly how the hash index resolves lookups.

## What is Static Hashing?

In a database management system, data lives on disk in fixed-size **pages**. To find a specific record without scanning every page, the system builds an **index**. A **static hash index** uses a hash function to map each record's search key directly to a **bucket** — a known location where the record (or a pointer to it) is stored.

When you search for a word, the system:
1. Hashes the word to get a search key
2. Applies a second hash to find the bucket ID
3. Looks in that bucket for a pointer (page ID + tuple ID) to the actual record
4. Jumps directly to the right page and retrieves the data

This avoids scanning the entire table — the lookup is essentially O(1).

## How the Simulation Works

### Hash Functions
The simulator uses a two-level hashing scheme:
- **Word → Search Key**: A Java-style `hashCode` implementation — for each character, it computes `hash = ((hash << 5) - hash) + charCode`, producing a 32-bit integer.
- **Search Key → Bucket ID**: `H(k) = |k| mod N`, where N is the number of distinct bucket IDs derived from the dataset (466,997 in the default word list).

### Pages
The raw data (≈466K English words with their hash IDs) is divided into **pages** — fixed-size blocks that simulate disk pages. You choose either:
- **Page Amount** — how many pages to create (the simulator calculates the size), or
- **Page Size** — how many tuples per page (the simulator calculates the count).

Records are randomly distributed across pages, mimicking how a real database scatters rows across disk blocks.

### Buckets
Each bucket holds pointers (page ID, tuple ID) to records that hash to that bucket. When a bucket fills up, additional records go into **overflow buckets** — chained structures that the system must scan sequentially. The simulator tracks:

| Metric | Description |
|---|---|
| Bucket Amount | Number of distinct hash buckets |
| Bucket Size | Max tuples per bucket (total rows ÷ bucket count) |
| Overflow Amount | Number of overflow buckets created |
| Overflow Rate | (Overflow count ÷ bucket count) × 100% |

High overflow rates mean the hash function distributes poorly or the bucket size is too small — exactly the trade-off database designers must balance.

### Search
Once the simulation builds, you can search for any word. The simulator shows:
- Which **bucket** the word hashes to
- Which **page** contains the actual record
- The **search key** (hash value)
- Whether the record was found in an **overflow bucket** (indicating a collision)

## Architecture

The project is a **client-only React SPA** with all simulation logic running in the browser:

- **Data**: A pre-computed dataset of ~466K English words with their hash IDs, loaded as a static JSON asset
- **Web Worker**: The heavy simulation (page building, bucket allocation, overflow handling) runs in a dedicated Web Worker thread to keep the UI responsive
- **Virtualized Rendering**: Uses `react-virtualized` to efficiently render hundreds of thousands of rows, pages, and buckets without killing the browser

## Live Demo

**https://medeirosvictor.github.io/static-hash-index**

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Configuration

On the main screen, configure the simulation:

- **Page Settings** — choose between setting Page Amount or Page Size (in tuples)
- **Value** — the number of pages or tuples per page

Click **Simulate** to build the hash index. The simulation constructs pages, allocates buckets, handles overflows, and displays everything. Then use the search bar to look up words and trace the hash lookup path.

## Tech Stack

- **React 16** with hooks and Context API
- **Vite** for bundling and dev server
- **Web Workers** for off-main-thread simulation
- **react-virtualized** for rendering large lists/collections
- **SASS** for styling

## Project Structure

```
src/
├── App.jsx                 # Root component, router, context provider
├── index.jsx               # Entry point
├── components/
│   ├── Simulation.jsx      # Main orchestrator — form, fetch, worker dispatch
│   ├── SimulationInfo.jsx  # Displays bucket/page/overflow stats
│   ├── SearchForm.jsx      # Word search with hash lookup logic
│   ├── SearchObject.jsx    # Displays search result details
│   ├── Table.jsx           # Virtualized table of all words
│   ├── PageList.jsx        # Virtualized grid of pages
│   ├── Page.jsx            # Single page with tuple list
│   ├── BucketList.jsx      # Virtualized grid of buckets
│   ├── Bucket.jsx          # Single bucket with hash tuples
│   ├── BucketOverflowList.jsx  # Overflow bucket chain
│   ├── BucketOverflow.jsx      # Single overflow bucket
│   ├── simulationWorker.js     # Web Worker — builds pages & buckets
│   ├── workerSetup.js          # Web Worker bootstrapper
│   ├── contexts/
│   │   └── SimulationContext.js    # React Context for simulation state
│   ├── helpers/
│   │   ├── Helpers.js         # Hash function, file reading, shuffle
│   │   └── InitState.js      # Default state shape
│   └── reducers/
│       └── simulationDataReducer.js  # State reducer (lodash merge)
├── static/
│   ├── css/index.css       # Compiled CSS
│   └── sass/index.scss     # SASS source
public/
├── words.json              # Pre-computed word dataset (~17MB)
└── index.html              # HTML shell
```
