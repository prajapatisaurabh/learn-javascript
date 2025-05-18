/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  let lastDigit = digits[digits.length - 1];
  lastDigit = lastDigit + 1;
  if ((lastDigit + "").length >= 2) {
    digits[digits.length - 1] = Number((lastDigit + "")[0]);
    digits.push(Number(lastDigit + "")[1]);
  } else {
    digits[digits.length - 1] = lastDigit;
  }
  return digits;
};

console.log(plusOne([1, 2, 9]));
