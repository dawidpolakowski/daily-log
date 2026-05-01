# Daily Log

A simple, automated daily logging system powered by shell scripts and GitHub Pages.

**Live site:** https://dawidpolakowski.github.io/daily-log/

---

## Features

* Create daily logs with one command
* Store logs in month folders like `logs/2026-04/2026-04-30.md`
* Auto-generate `logs.json` from Markdown files
* Extract titles directly from each file's first `# Heading`
* Publish logs via GitHub Pages
* Search, filter, paginate, and read Markdown logs in the browser

---

## How It Works

1. Run the script:

   ```bash
   ./newlog.sh "Your log title"
   ```

2. Script will:

   * Create a new log file in the current month folder
   * Add a title and starter template
   * Scan all month folders
   * Regenerate `logs.json`

3. GitHub Pages displays logs automatically on:

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
|-- newlog.sh         # Log generator script
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

* Shell (bash)
* jq (JSON processing)
* Vanilla JavaScript
* GitHub Pages (static hosting)

---

## Requirements

Install `jq`:

```bash
sudo apt install jq
# or
brew install jq
```

---

## Future Improvements

* Tags support inside logs
* GitHub Actions automation for creating or validating logs
* SEO pages per log

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
