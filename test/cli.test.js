import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../src/cli.js', import.meta.url));
const run = (args, stdin) => spawnSync(process.execPath, [CLI, ...args], { input: stdin, encoding: 'utf8' });

test('check keeps treating its arguments as one spaced number', () => {
  const r = run(['check', '4111', '1111', '1111', '1111']);
  assert.equal(r.stdout.trim(), 'valid');
  assert.equal(r.status, 0);
  assert.equal(run(['check', '79927398710']).status, 1);
});

test('digit prints the check digit', () => {
  assert.equal(run(['digit', '7992739871']).stdout.trim(), '3');
  assert.equal(run(['digit', '12a']).status, 2);
});

test('scan reads standard input, one number per line', () => {
  const r = run(['scan'], '79927398713\n\n# a comment\n4111 1111 1111 1111\r\n79927398710\n');
  assert.deepEqual(r.stdout.trim().split(/\r?\n/), [
    'valid\t79927398713',
    'valid\t4111 1111 1111 1111',
    'invalid\t79927398710',
  ]);
  assert.match(r.stderr, /3 checked, 2 valid, 1 invalid/);
  assert.equal(r.status, 1);
});

test('scan exits 0 when every number is valid', () => {
  assert.equal(run(['scan'], '79927398713\n5555555555554444\n').status, 0);
});

test('scan reads files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'luhn-'));
  const a = join(dir, 'a.txt');
  const b = join(dir, 'b.txt');
  writeFileSync(a, '79927398713\n');
  writeFileSync(b, '378282246310005\n');
  const r = run(['scan', a, b]);
  assert.equal(r.stdout.trim().split(/\r?\n/).length, 2);
  assert.equal(r.status, 0);
});

test('scan with nothing to check, or a missing file, exits 2', () => {
  assert.equal(run(['scan'], '\n# only a comment\n').status, 2);
  assert.equal(run(['scan', join(tmpdir(), 'no-such-file-138.txt')]).status, 2);
});

test('an unknown command prints the usage and exits 2', () => {
  const r = run(['nope']);
  assert.match(r.stderr, /usage: luhn check/);
  assert.equal(r.status, 2);
});
