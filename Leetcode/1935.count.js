/**
 * @param {string} text
 * @param {string} brokenLetters
 * @return {number}
 */
var canBeTypedWords = function (text, brokenLetters) {
  let splits = text.split(" ");
  let count = 0;
  for (let i = 0; i < splits.length; i++) {
    const element = splits[i];

    for (let j = 0; j < brokenLetters.length; j++) {
      const latter = brokenLetters[j];
      if (element.includes(latter)) {
        count++;
        break;
      }
    }
  }
  return count;
};

canBeTypedWords("leet code", "e");
