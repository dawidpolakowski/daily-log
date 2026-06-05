# Daily Log

A simple, automated daily logging system powered by a small Node script and GitHub Pages.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made with Node](https://img.shields.io/badge/Node-%E2%89%A518-339933?logo=node.js&logoColor=white)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Deploy](https://github.com/dawidpolakowski/daily-log/actions/workflows/deploy.yml/badge.svg)](https://github.com/dawidpolakowski/daily-log/actions/workflows/deploy.yml)

**Live site:** https://dawidpolakowski.github.io/daily-log/

> An open-source, dependency-free project. Contributions welcome — see
> [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Features

* Create daily logs with one command
* Store logs in month folders like `logs/2026-04/2026-04-30.md`
* Auto-generate `logs.json` (title, excerpt, and tags) from Markdown files
* Extract titles directly from each file's first `# Heading`
* Publish logs via GitHub Pages
* Search, filter, paginate, and read Markdown logs in the browser
* Tag logs with a `## Tags` section and filter by clicking a tag chip
* Light / dark theme toggle (remembers your choice)

---

## How It Works

1. Create today's log:

   ```bash
   npm run new -- "Your log title"
   # or directly:
   node scripts/new.js "Your log title"
   ```

   The title is optional — it defaults to `Development Log - <date>`.

2. The script will:

   * Create a new log file in the current month folder
   * Add a title and starter template
   * Scan all month folders
   * Regenerate `logs.json`

3. Rebuild the index without creating a log (e.g. after editing a title):

   ```bash
   npm run build
   ```

   This also runs automatically in CI on every push, so the index never drifts.

4. GitHub Pages displays logs automatically on:

   ```
   /index.html
   ```

---

## Project Structure

```
daily-log/
|-- index.html        # Main timeline page
|-- log.html          # Markdown reader page
|-- script.js         # Loads, filters, and paginates logs.json
|-- style.css         # App styling
|-- package.json      # npm scripts: new, build
|-- scripts/
|   |-- lib.js        # Core: template, title extraction, index builder
|   |-- new.js        # Create today's log + rebuild index
|   `-- build.js      # Rebuild logs.json only
│
`-- logs/
    |-- 2026-03/
    |   |-- 2026-03-22.md
    |   `-- 2026-03-23.md
    |-- 2026-04/
    |   `-- 2026-04-30.md
    `-- logs.json
```

---

## Log Format

Each log is a markdown file:

```md
# Your Title Here

## Date
2026-03-23

## Work done
-

## Notes
-

## Ideas / Next steps
-
```

The first `# Title` line is used automatically in the UI.

---

## logs.json

Example:

```json
[
  {
    "date": "2026-03-23",
    "month": "2026-03",
    "title": "Built GitHub Pages auto logs",
    "file": "2026-03/2026-03-23.md"
  }
]
```

Do not edit manually. It is regenerated on each script run.

---

## GitHub Pages Setup

Go to:

**Settings → Pages**

* Source: `Deploy from a branch`
* Branch: `main`
* Folder: `/ (root)`

---

## Tech Stack

* Node.js (zero-dependency log generator)
* Vanilla JavaScript (frontend)
* GitHub Pages (static hosting)

---

## Requirements

* Node.js 18+ (no npm dependencies to install)

---

## Future Improvements

* SEO pages per log
* RSS / Atom feed
* Per-tag archive pages

---

## Use Cases

* Developer daily logs
* Project journals
* Learning tracking
* Content planning
* Personal knowledge base

---

## Contributing

Feel free to fork and improve — this project is designed to stay simple and extensible.

---

## License

MIT

---

## Author

Created by **Dawid Polakowski**
GitHub: https://github.com/dawidpolakowski
