/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  let output = new Set();

  for (let i = 0; i < nums2.length; i++) {
    let element = nums2[i];
    if (nums1.includes(element)) {
      output.add(element);
    }
  }

  return Array.from(output);
};

console.log(intersection([4, 9, 5], [2, 2]));
