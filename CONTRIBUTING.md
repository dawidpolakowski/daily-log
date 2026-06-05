# Contributing to Daily Logs

Thanks for your interest in contributing! This project is intentionally small,
dependency-free, and easy to hack on.

## Getting started

You only need **Node.js 18+** — there are no npm dependencies to install.

```bash
git clone https://github.com/dawidpolakowski/daily-log.git
cd daily-log
```

Create a log:

```bash
npm run new -- "Your log title"
```

Rebuild the index (after editing titles, tags, or content):

```bash
npm run build
```

Preview the site locally with any static server, e.g.:

```bash
npx serve .
# then open http://localhost:3000
```

> The cards fetch `logs/logs.json`, so the site must be served over HTTP —
> opening `index.html` directly from disk will not load the logs.

## Project layout

| Path             | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `index.html`     | Timeline page                                      |
| `log.html`       | Markdown reader                                    |
| `script.js`      | Loads, filters, and paginates `logs.json`          |
| `style.css`      | Theme (light/dark, CSS variables)                  |
| `scripts/`       | Node generator (`new.js`, `build.js`, `lib.js`)    |
| `logs/`          | Markdown logs + generated `logs.json`              |

## Guidelines

- **Don't edit `logs/logs.json` by hand** — it's generated. Run `npm run build`.
- Keep the project **dependency-free** (vanilla JS + Node standard library).
- Match the existing code style: 2-space indentation, semicolons, small functions.
- One focused change per pull request.

## Pull requests

1. Fork the repo and create a branch: `git checkout -b my-change`.
2. Make your change and run `npm run build` if you touched logs or the generator.
3. Open a PR describing **what** changed and **why**.

## Reporting bugs / ideas

Open an issue using one of the templates. Include steps to reproduce for bugs.
