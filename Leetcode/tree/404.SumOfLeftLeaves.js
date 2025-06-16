/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumOfLeftLeaves = function (root) {
  // dfs
  let sum = 0;
  const dfs = (node) => {
    if (!node) return;
    if (node.left && !node.left.left && !node.left.right) {
      sum += node.left.val;
    }
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return sum;
};
