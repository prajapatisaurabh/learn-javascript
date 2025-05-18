/**
 * @param {number} k
 * @return {character}
 */
var kthCharacter = function (k) {
  let word = "a";

  while (word.length < k) {
    // Convert string to array to map
    let newWord = word
      .split("")
      .map((ch) => String.fromCharCode(ch.charCodeAt(0) + 1))
      .join("");

    word += newWord;
  }

  return word[k - 1]; // 0-indexed
};

console.log(kthCharacter(5));
