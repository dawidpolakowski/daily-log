# Daily Development Log

A simple repository used to keep a daily engineering log of development work.

The goal of this project is to document daily progress, ideas, fixes, and experiments while maintaining a clean Git history.

Logs are stored as Markdown files using the format:

logs/YYYY-MM-DD.md


Repository Structure
```
daily-log
├─ logs/
│  ├─ 2026-03-04.md
│  ├─ 2026-03-05.md
│  └─ ...
├─ newlog.sh
└─ README.md
```

Log Format

Each daily file contains a simple structure:

# Development Log - YYYY-MM-DD

## Work done
-

## Notes
-

## Ideas / Next steps
-


Creating a New Daily Log

Run the helper script:
```
./newlog.sh
```
The script will:
- create the logs/ directory if it does not exist
- generate today's log file
- avoid overwriting an existing log


Typical Daily Workflow

./newlog.sh
git add logs/*
git commit -m "log: daily development notes"
git push


Why Keep a Daily Log

Benefits include:
- tracking development progress
- documenting ideas and experiments
- maintaining consistent Git activity
- creating a personal engineering journal


License

MIT