#!/usr/bin/env node
import { buildIndex } from './lib.js';

const entries = await buildIndex();
console.log(`logs.json regenerated (${entries.length} entries)`);
