/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let map = {};
  let majorityCount = Math.floor(nums.length / 2);

  for (let num of nums) {
    map[num] = (map[num] || 0) + 1;
    if (map[num] > majorityCount) {
      return num;
    }
  }
};

console.log(majorityElement([2, 4, 4, 1, 3, 5]));
