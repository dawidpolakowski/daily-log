# 📘 Daily Log

A simple, automated daily logging system powered by shell scripts and GitHub Pages.

🔗 **Live site:** https://dawidpolakowski.github.io/daily-log/

---

## 🚀 Features

* ✅ Create daily logs with one command
* ✅ Auto-generate `logs.json` (no manual updates)
* ✅ Extract titles directly from markdown files
* ✅ Publish logs via GitHub Pages
* ✅ Clean, minimal, scalable structure

---

## ⚙️ How It Works

1. Run the script:

   ```bash
   ./newlog.sh "Your log title"
   ```

2. Script will:

   * Create a new log file in `/logs`
   * Add a title + template
   * Scan all logs
   * Regenerate `logs.json`

3. GitHub Pages displays logs automatically on:

   ```
   /index.html
   ```

---

## 📂 Project Structure

```
daily-log/
│── index.html        # Main page
│── script.js         # Loads logs.json
│── style.css         # Styling
│── newlog.sh         # Log generator script
│
└── logs/
    ├── 2026-03-23.md
    ├── 2026-03-22.md
    └── logs.json
```

---

## 📝 Log Format

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

👉 The **first `# Title` line is used automatically** in the UI.

---

## 🔄 logs.json (Auto-generated)

Example:

```json
[
  {
    "title": "Built GitHub Pages auto logs",
    "file": "2026-03-23.md"
  }
]
```

⚠️ Do not edit manually — it is regenerated on each script run.

---

## 🌐 GitHub Pages Setup

Go to:

**Settings → Pages**

* Source: `Deploy from a branch`
* Branch: `main`
* Folder: `/ (root)`

---

## 🧠 Tech Stack

* Shell (bash)
* jq (JSON processing)
* Vanilla JavaScript
* GitHub Pages (static hosting)

---

## 🔧 Requirements

Install `jq`:

```bash
sudo apt install jq
# or
brew install jq
```

---

## 🚀 Future Improvements

* 🔍 Search & filters
* 🏷️ Tags support inside logs
* 📄 Markdown rendering (instead of raw view)
* ⚡ GitHub Actions automation
* 🎨 Custom UI (cyberpunk / forest theme)
* 📈 SEO pages per log

---

## 📌 Use Cases

* Developer daily logs
* Project journals
* Learning tracking
* Content planning
* Personal knowledge base

---

## 🤝 Contributing

Feel free to fork and improve — this project is designed to stay simple and extensible.

---

## 📄 License

MIT

---

## 🔗 Author

Created by **Dawid Polakowski**
GitHub: https://github.com/dawidpolakowski
