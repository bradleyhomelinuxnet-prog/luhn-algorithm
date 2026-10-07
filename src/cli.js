#!/usr/bin/env node
// Usage:
//   node src/cli.js check 79927398713     -> valid / invalid
//   node src/cli.js digit 7992739871      -> 3
import { isValid, checkDigit } from './luhn.js';

const [command, ...rest] = process.argv.slice(2);
const input = rest.join(' ');

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
} else {
  console.error('usage: luhn check <number> | luhn digit <number-without-check-digit>');
  process.exit(2);
}
