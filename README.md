# Luhn Algorithm

[![tests](https://github.com/bradleyhomelinuxnet-prog/luhn-algorithm/actions/workflows/test.yml/badge.svg)](https://github.com/bradleyhomelinuxnet-prog/luhn-algorithm/actions/workflows/test.yml) [![Live site](https://img.shields.io/badge/live-site-d8a943)](https://bradleyhomelinuxnet-prog.github.io/luhn-algorithm/) [![license: MIT](https://img.shields.io/badge/license-MIT-3d6fb4)](https://github.com/bradleyhomelinuxnet-prog/luhn-algorithm/blob/main/LICENSE) [![node: >=18](https://img.shields.io/badge/node-%3E%3D18-5fa04e)](https://github.com/bradleyhomelinuxnet-prog/luhn-algorithm/blob/main/package.json) ![No dependencies](https://img.shields.io/badge/dependencies-none-7faa5a)

**Live demo: [bradleyhomelinuxnet-prog.github.io/luhn-algorithm](https://bradleyhomelinuxnet-prog.github.io/luhn-algorithm/)**

The Luhn (mod 10) checksum, the check behind credit card numbers, IMEIs and many other IDs. Plain JavaScript with no dependencies.

## How it works

1. Start from the rightmost digit and move left.
2. Double every second digit. If the result is more than 9, subtract 9.
3. Add everything up. The number is valid when the total is a multiple of 10.

`7 9 9 2 7 3 9 8 7 1 3` → counted as `7 9 9 4 7 6 9 7 7 2 3` → total 70 → **valid**.

## Use it

```js
import { isValid, checkDigit, withCheckDigit } from './src/luhn.js';

isValid('4111 1111 1111 1111'); // true  (spaces and dashes are ignored)
isValid('79927398710');         // false
checkDigit('7992739871');       // 3
withCheckDigit('7992739871');   // '79927398713'
```

From the command line:

```bash
node src/cli.js check 79927398713   # valid
node src/cli.js digit 7992739871    # 3
node src/cli.js scan numbers.txt    # one result per line
```

`scan` checks one number per line, from files or piped in, and skips blank lines and `#` comments. It prints `valid` or `invalid`, a tab and the number, then a summary. It exits 0 if every number is valid, 1 if any is not, and 2 if there was nothing to check.

## Tests

```bash
npm test
```

The tests cover the command line and published test numbers, invalid and malformed input, 1,000 random round trips through `withCheckDigit`, and every single-digit typo of a valid number. No external packages, just Node's built-in test runner. CI runs them on Node 18, 20 and 22.

All card numbers in this repo are the networks' published test numbers, not real accounts.
