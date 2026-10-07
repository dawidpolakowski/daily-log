# Contribution graph playbook

Reference for how this repo is used to keep the GitHub contribution graph
filled, and how the history was built. The repo doubles as a daily journal and
as a safe, scriptable way to add backdated commits.

## How GitHub counts commits

- Credit goes to the **author email**, which must be verified on the account
  (`dawidpolakowski@gmail.com`). Other emails do not count.
- Only commits on the **default branch** (`main`) count.
- **Future-dated** commits are not shown.
- Shading is relative (quartiles of the busiest day), so one very busy day makes
  everything else look faint. The page and browsers also cache the graph, so
  refresh before assuming commits are missing.
- The total (e.g. "872 contributions in the last year") also includes other repos.

## Backdating a commit

```bash
export GIT_COMMITTER_NAME=dawidpolakowski GIT_COMMITTER_EMAIL=dawidpolakowski@gmail.com
DT="2026-08-19 20:00:00 +0100"
GIT_COMMITTER_DATE="$DT" git commit --author "dawidpolakowski <dawidpolakowski@gmail.com>" --date "$DT" -m "Title"
```

`--date` sets the author date and `GIT_COMMITTER_DATE` the committer date; set both.

## History so far

1. Early backfill: one themed log per missing day, a February "writing a book"
   theme, and appended-bullet commits that happened to shade a smiley face
   (days with 6 commits in Feb-Mar 2026).
2. 2026-10-07: filled every missing day 2026-08-19..2026-10-07 with a log and
   one commit at 20:00 +0100. Days with real commits in sibling repos
   (timecorder, soundcorder, guinea-pig-dash, Crystal-Mind, typewriterx,
   diskcorder) describe that work; the rest use generic themes. 05.10/06.10 are
   about the Hostinger migration and SEO work (no details).
3. 2026-10-07: added ~830 extra bullet commits (1-15 per day, weekday-heavy,
   times 09:00-22:30) across 2026-02-01..2026-10-06 so the smiley blends in.
   History was **not** rewritten, so no force-push was needed.

## Scripts (reference copies)

- `docs/reference/fill-missing-days.mjs` - generates a log per missing day from
  a map of real work plus rotating filler themes. Edit the date range first.
- `docs/reference/boost-commits.mjs` - appends a bullet to a day's log and makes
  one backdated commit per bullet, with randomised per-day counts.

Both are run from the repo root, were written as one-off tools, and have the date
ranges hard-coded. After either, run `npm run build` and commit `logs/logs.json`
(CI fails on index drift).

## Checklist for the next backfill

1. Check the last log date and list missing days.
2. Look at sibling repos (`git log --since=...`) so logs describe real work.
3. Create logs, commit one per day at a past time, never in the future.
4. `npm run build`, commit `logs.json`, push `main`.
5. Never run `npm run reset` here; it wipes `logs/`.
