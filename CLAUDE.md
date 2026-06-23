# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A zero-dependency static site that turns a folder of Markdown daily logs into a
searchable, paginated timeline deployed to GitHub Pages. There is no framework,
bundler, or runtime npm dependency — the tooling is plain Node (ESM, `"type":
"module"`, Node 18+) and the frontend is vanilla JS.

## Commands

```bash
npm run new -- "Title"   # scaffold logs/YYYY-MM/YYYY-MM-DD.md (today) + rebuild index
npm run build            # rebuild logs/logs.json from the Markdown files
npm run serve            # static dev server at http://localhost:3000 (PORT env overrides)
npm run reset            # DESTRUCTIVE: wipe logs/ + reseed a welcome entry (for forkers; never run in this repo)
```

`reset` (`scripts/reset.js` → `resetLogs()` in lib.js) exists so people who fork
or use the template can clear the demo logs. **Do not run it against this repo** —
it deletes the author's real logs.

There is no test suite, linter, or build step beyond `scripts/build.js`. CI runs
on Node 22; local dev only needs Node 18+.

## The index-drift contract (important)

`logs/logs.json` is a **generated** file — never edit it by hand. It is the
single source the frontend fetches; the Markdown files are the source of truth it
is derived from. After changing any log's title, body, or tags, you **must** run
`npm run build` and commit the regenerated `logs.json`.

CI (`.github/workflows/ci.yml`) enforces this: it runs `node scripts/build.js` and
fails the build if `git diff` shows `logs.json` changed. `deploy.yml` also
rebuilds the index before publishing, so a stale committed index won't reach
production — but it will still fail CI on the PR.

## Architecture

The whole system is three layers connected by `logs.json`:

1. **Generator (`scripts/`)** — all real logic lives in `scripts/lib.js`:
   - `createLog()` writes a log from `logTemplate()`; no-op if the file exists.
   - `buildIndex()` scans `logs/<YYYY-MM>/<YYYY-MM-DD>.md` (strict regexes
     `MONTH_RE` / `DAY_FILE_RE` — files not matching the pattern are ignored),
     extracts metadata, sorts newest-first, and writes `logs.json`.
   - `extractTitle` (first `# heading`), `extractExcerpt` (first meaningful body
     line, skipping headings/date/empty bullets), `extractTags` (a `## Tags`
     section's next line, or an inline `Tags:` line) are the parsing rules.
   - `new.js` / `build.js` are thin CLI wrappers over `lib.js`; `serve.js` is a
     standalone static file server with path-traversal guarding.

2. **Frontend (`index.html` + `script.js` + `style.css`)** — `script.js` fetches
   `logs.json`, then does all search/month-filter/pagination client-side
   (`PAGE_SIZE = 9`). `normalizeLog()` defensively backfills missing fields so the
   page still renders against an older index shape. Tag chips trigger a search by
   that tag.

3. **Reader (`log.html`)** — renders a single Markdown file (passed as
   `?file=YYYY-MM/YYYY-MM-DD.md`) using the `marked` library from a CDN. This is
   the one place an external script is loaded at runtime.

## Log file format

`scripts/new.js` generates this template; the parser depends on its shape:

```markdown
# Your Title Here   ← becomes the card title (extractTitle)

## Date
2026-04-30

## Work done
- ...               ← first real line here becomes the excerpt

## Tags
- frontend, release ← comma/semicolon separated; the line AFTER the heading
```

Dates use **local time** (`todayKey()`), not UTC — keep that in mind for any
date logic.

## Deployment

GitHub Pages deploys from `main` via `.github/workflows/deploy.yml`. It rebuilds
the index, replaces the literal `__BUILD_ID__` placeholder in `index.html` with
the short commit SHA, publishes, then polls the live URL to verify that build ID
appears. The placeholder must stay intact in `index.html` for the verify step to
pass.
