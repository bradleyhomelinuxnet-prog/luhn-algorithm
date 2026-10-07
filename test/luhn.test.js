import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValid, checkDigit, withCheckDigit, normalize } from '../src/luhn.js';

// Published test numbers only: none of these is a real account.
const VALID = [
  '79927398713',          // the classic example
  '4539 3195 0343 6467',  // Visa test number
  '4111-1111-1111-1111',  // Visa test number
  '5555555555554444',     // Mastercard test number
  '378282246310005',      // American Express test number
  '6011111111111117',     // Discover test number
  '490154203237518',      // IMEI example
  '059',
  '00',
];

const INVALID = [
  '79927398710',
  '4111111111111112',
  '8273 1232 7352 0569',
  '1234567812345678',
];

test('accepts valid numbers', () => {
  for (const n of VALID) assert.equal(isValid(n), true, n);
});

test('rejects invalid numbers', () => {
  for (const n of INVALID) assert.equal(isValid(n), false, n);
});

test('rejects input that is not a number', () => {
  for (const n of ['', ' ', '0', '7', '4111 1111 1111 111a', '12.34', null, undefined, 4111111111111111]) {
    assert.equal(isValid(n), false, String(n));
  }
});

test('computes the check digit', () => {
  assert.equal(checkDigit('7992739871'), 3);
  assert.equal(checkDigit('411111111111111'), 1);
  assert.equal(checkDigit('0'), 0);
  assert.equal(withCheckDigit('7992739871'), '79927398713');
});

test('every number with its check digit appended is valid', () => {
  let seed = 138;
  const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let i = 0; i < 1000; i++) {
    const len = 1 + Math.floor(rand() * 20);
    let n = '';
    for (let j = 0; j < len; j++) n += Math.floor(rand() * 10);
    assert.equal(isValid(withCheckDigit(n)), true, n);
  }
});

test('catches every single-digit typo', () => {
  const good = '79927398713';
  for (let i = 0; i < good.length; i++) {
    for (let d = 0; d <= 9; d++) {
      if (String(d) === good[i]) continue;
      const typo = good.slice(0, i) + d + good.slice(i + 1);
      assert.equal(isValid(typo), false, typo);
    }
  }
});

test('normalize strips spaces and dashes and rejects other characters', () => {
  assert.equal(normalize(' 4111-1111 1111-1111 '), '4111111111111111');
  assert.throws(() => normalize('41a1'), TypeError);
  assert.throws(() => normalize(42), TypeError);
});
