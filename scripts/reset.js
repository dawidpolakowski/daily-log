#!/usr/bin/env node
// Clear the demo/personal logs so a fork starts fresh.
// Usage:
//   npm run reset            remove all logs and seed one welcome entry
//   npm run reset -- --empty remove all logs and leave them empty
//   npm run reset -- --yes   skip the confirmation prompt (for CI/scripts)
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { resetLogs } from './lib.js';

const args = new Set(process.argv.slice(2));
const seed = !args.has('--empty');
const skipPrompt = args.has('--yes') || args.has('-y') || !stdin.isTTY;

if (!skipPrompt) {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(
    'This deletes every log under logs/ and resets the index. Continue? [y/N] ',
  );
  rl.close();

  if (!/^y(es)?$/i.test(answer.trim())) {
    console.log('Aborted. No changes made.');
    process.exit(0);
  }
}

const { removed, seeded } = await resetLogs({ seed });
console.log(`Removed ${removed} month folder(s).`);
console.log(seeded ? 'Seeded a welcome log for today.' : 'Left logs empty.');
console.log('Done. Run `npm run new -- "My first log"` to start writing.');
