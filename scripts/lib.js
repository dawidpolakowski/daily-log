import { access, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const LOG_DIR = 'logs';
export const INDEX_FILE = path.join(LOG_DIR, 'logs.json');

const MONTH_RE = /^\d{4}-\d{2}$/;
const DAY_FILE_RE = /^(\d{4}-\d{2}-\d{2})\.md$/;

/** Local-time date key, e.g. "2026-06-05". */
export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function logTemplate(title, dateKey) {
  return `# ${title}

## Date
${dateKey}

## Work done
-

## Notes
-

## Ideas / Next steps
-

## Tags
-
`;
}

/** First "# Heading" in a markdown document, or null. */
export function extractTitle(markdown) {
  for (const line of markdown.split(/\r?\n/)) {
    const match = /^#\s+(.+)/.exec(line);
    if (match) return match[1].trim();
  }

  return null;
}

/** First meaningful line of body text, used as a card preview. */
export function extractExcerpt(markdown, maxLength = 150) {
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;       // blank lines / headings
    if (/^\d{4}-\d{2}-\d{2}$/.test(line)) continue;     // the bare date line
    if (line === '-') continue;                         // empty bullet

    const text = line.replace(/^[-*]\s+/, '').replace(/[*`_>]/g, '').trim();
    if (!text) continue;

    return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
  }

  return '';
}

/** Tags from a "## Tags" section or a "Tags:" line. Returns a string array. */
export function extractTags(markdown) {
  const lines = markdown.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    let raw = null;
    if (/^#{1,6}\s+tags\b/i.test(line)) {
      raw = (lines[i + 1] || '').trim().replace(/^[-*]\s+/, '');
    } else if (/^tags\s*:/i.test(line)) {
      raw = line.replace(/^tags\s*:/i, '');
    }

    if (raw) {
      return [...new Set(
        raw.split(/[,;]/).map((t) => t.trim().replace(/^#/, '')).filter((t) => t && t !== '-'),
      )];
    }
  }

  return [];
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a daily log file from the template.
 * No-op if the file already exists. Returns { created, file }.
 */
export async function createLog(title, dateKey = todayKey()) {
  const monthKey = dateKey.slice(0, 7);
  const monthDir = path.join(LOG_DIR, monthKey);
  const file = path.join(monthDir, `${dateKey}.md`);

  await mkdir(monthDir, { recursive: true });

  if (await exists(file)) {
    return { created: false, file };
  }

  const resolvedTitle = title?.trim() || `Development Log - ${dateKey}`;
  await writeFile(file, logTemplate(resolvedTitle, dateKey));

  return { created: true, file };
}

/** A friendly first log so a fresh install isn't an empty page. */
export function welcomeTemplate(dateKey = todayKey()) {
  return `# Welcome to your daily log

## Date
${dateKey}

## Work done
- Set up my own Daily Log and cleared the demo entries.

## Notes
- Create a new entry with \`npm run new -- "Title"\`.
- Preview locally with \`npm run serve\`.

## Ideas / Next steps
- Write something tomorrow.

## Tags
- getting-started
`;
}

/**
 * Remove every demo/personal log so a fork starts clean.
 * Deletes all logs/<YYYY-MM>/ folders and resets the index.
 * By default seeds one "welcome" entry for today; pass { seed: false }
 * to leave the logs empty. Returns { removed, seeded }.
 */
export async function resetLogs({ seed = true } = {}) {
  let months = [];
  try {
    months = await readdir(LOG_DIR, { withFileTypes: true });
  } catch {
    months = [];
  }

  let removed = 0;
  for (const month of months) {
    if (!month.isDirectory() || !MONTH_RE.test(month.name)) continue;
    await rm(path.join(LOG_DIR, month.name), { recursive: true, force: true });
    removed += 1;
  }

  await mkdir(LOG_DIR, { recursive: true });

  let seeded = false;
  if (seed) {
    const dateKey = todayKey();
    const monthDir = path.join(LOG_DIR, dateKey.slice(0, 7));
    await mkdir(monthDir, { recursive: true });
    await writeFile(path.join(monthDir, `${dateKey}.md`), welcomeTemplate(dateKey));
    seeded = true;
  }

  await buildIndex();

  return { removed, seeded };
}

/**
 * Scan logs/YYYY-MM/YYYY-MM-DD.md, rebuild logs.json (newest first),
 * and return the entries.
 */
export async function buildIndex() {
  let months = [];
  try {
    months = await readdir(LOG_DIR, { withFileTypes: true });
  } catch {
    months = [];
  }

  const entries = [];

  for (const month of months) {
    if (!month.isDirectory() || !MONTH_RE.test(month.name)) continue;

    const monthDir = path.join(LOG_DIR, month.name);
    const files = await readdir(monthDir);

    for (const file of files) {
      const match = DAY_FILE_RE.exec(file);
      if (!match) continue;

      const dateKey = match[1];
      const markdown = await readFile(path.join(monthDir, file), 'utf8');

      entries.push({
        date: dateKey,
        month: month.name,
        file: `${month.name}/${file}`,
        title: extractTitle(markdown) || `Daily Log - ${dateKey}`,
        excerpt: extractExcerpt(markdown),
        tags: extractTags(markdown),
      });
    }
  }

  entries.sort((a, b) => b.date.localeCompare(a.date));

  await writeFile(INDEX_FILE, `${JSON.stringify(entries, null, 2)}\n`);

  return entries;
}
