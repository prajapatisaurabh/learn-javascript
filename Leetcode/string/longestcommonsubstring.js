class Solution {
  longestCommonPrefix(strs) {
    if (strs.length === 0) {
      return "";
    }
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
      while (strs[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
      }
    }
    return prefix;
  }
}

const solution = new Solution();
console.log(solution.longestCommonPrefix(["flower", "flow", "flight"]));
console.log(solution.longestCommonPrefix(["dog", "racecar", "car"]));
console.log(solution.longestCommonPrefix([]));
console.log(solution.longestCommonPrefix(["a"]));
console.log(solution.longestCommonPrefix(["ab", "a"]));
console.log(solution.longestCommonPrefix(["flower", "flow", "flight"]));
