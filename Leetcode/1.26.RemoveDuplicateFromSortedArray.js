/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let i = 0;

  while (i < nums.length) {
    if (nums[i] == nums[i + 1]) {
      i++;
      continue;
    }
    console.log(nums[i]);
    i++;
  }
};

removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]); // Output: 2, nums = [1, 2]
