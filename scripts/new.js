#!/usr/bin/env node
import { buildIndex, createLog } from './lib.js';

const title = process.argv.slice(2).join(' ');

const { created, file } = await createLog(title);
console.log(created ? `Log created: ${file}` : `Log already exists: ${file}`);

const entries = await buildIndex();
console.log(`logs.json regenerated (${entries.length} entries)`);
