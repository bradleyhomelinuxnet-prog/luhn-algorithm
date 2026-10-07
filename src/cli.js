#!/usr/bin/env node
// Usage:
//   node src/cli.js check 79927398713     -> valid / invalid
//   node src/cli.js digit 7992739871      -> 3
//   node src/cli.js scan numbers.txt      -> one line per number: valid/invalid, a tab, the number
//   some-command | node src/cli.js scan   -> the same, reading standard input
import { readFileSync } from 'node:fs';
import { isValid, checkDigit } from './luhn.js';

const [command, ...rest] = process.argv.slice(2);
const input = rest.join(' ');

/**
 * Check one number per line. Blank lines and lines starting with # are skipped.
 * Exit code: 0 if every number is valid, 1 if any is not, 2 if there was nothing to check.
 */
function scan(files) {
  let text;
  try {
    // fd 0 is standard input, so `scan` with no files reads a pipe.
    text = (files.length ? files : [0]).map((f) => readFileSync(f, 'utf8')).join('\n');
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
  let checked = 0;
  let invalid = 0;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const ok = isValid(line);
    checked++;
    if (!ok) invalid++;
    console.log(`${ok ? 'valid' : 'invalid'}\t${line}`);
  }
  if (!checked) {
    console.error('no numbers to check');
    process.exit(2);
  }
  console.error(`${checked} checked, ${checked - invalid} valid, ${invalid} invalid`);
  process.exit(invalid ? 1 : 0);
}

if (command === 'check' && input) {
  const ok = isValid(input);
  console.log(ok ? 'valid' : 'invalid');
  process.exit(ok ? 0 : 1);
} else if (command === 'digit' && input) {
  try {
    console.log(checkDigit(input));
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
} else if (command === 'scan') {
  scan(rest);
} else {
  console.error('usage: luhn check <number> | luhn digit <number-without-check-digit> | luhn scan [file...]');
  process.exit(2);
}
