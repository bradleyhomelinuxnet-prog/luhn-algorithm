// The Luhn (mod 10) algorithm: the checksum behind credit card numbers,
// IMEI numbers and many other identifiers.
//
// Working from the rightmost digit, double every second digit. If doubling
// gives a two-digit number, subtract 9 (the same as adding its digits).
// The number is valid when the sum of all the digits is a multiple of 10.

/**
 * Remove spaces and dashes, and check that only digits are left.
 * @param {string} input
 * @returns {string} the digits
 */
export function normalize(input) {
  if (typeof input !== 'string') {
    throw new TypeError('expected a string of digits');
  }
  const digits = input.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(digits)) {
    throw new TypeError(`not a number: ${JSON.stringify(input)}`);
  }
  return digits;
}

/**
 * The Luhn sum of a string of digits.
 * @param {string} digits
 * @param {boolean} doubleFirst whether to double the rightmost digit
 */
function luhnSum(digits, doubleFirst) {
  let sum = 0;
  let double = doubleFirst;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum;
}

/**
 * Does this number pass the Luhn check? Spaces and dashes are ignored.
 * Numbers shorter than two digits are never valid.
 * @param {string} input
 * @returns {boolean}
 */
export function isValid(input) {
  let digits;
  try {
    digits = normalize(input);
  } catch {
    return false;
  }
  if (digits.length < 2) return false;
  return luhnSum(digits, false) % 10 === 0;
}

/**
 * The check digit that makes `input` + digit valid.
 * @param {string} input the number without its check digit
 * @returns {number} 0 to 9
 */
export function checkDigit(input) {
  const digits = normalize(input);
  return (10 - (luhnSum(digits, true) % 10)) % 10;
}

/**
 * Append the check digit.
 * @param {string} input the number without its check digit
 * @returns {string}
 */
export function withCheckDigit(input) {
  const digits = normalize(input);
  return digits + checkDigit(digits);
}
