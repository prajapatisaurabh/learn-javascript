/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
// var moveZeroes = function (nums) {
//   let arr = new Array(nums.length).fill(0);
//   let k = 0;
//   for (let i = 0; i < nums.length; i++) {
//     const element = nums[i];
//     if (element !== 0) {
//       arr[k] = element;
//       k++;
//     }
//   }
//   return arr;
// };

// Here above logic is not work in leetcode because it is volitating in-place algo issue

var moveZeroes = function (nums) {
  let insertPos = 0;

  // First, move all non-zero elements forward
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }

  // Then, fill remaining positions with zeros
  while (insertPos < nums.length) {
    nums[insertPos] = 0;
    insertPos++;
  }
};

console.log(moveZeroes([0, 1, 0, 3, 12]));
