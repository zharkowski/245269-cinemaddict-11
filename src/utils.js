const getRandomNumber = (end, start = 0) => Math.floor(start + Math.random() * (end + 1 - start));

const getRandomElement = (arrayElements) => arrayElements[getRandomNumber(arrayElements.length - 1)];

const getFirstWord = (str) => str.indexOf(` `) === -1 ? str : str.substr(0, str.indexOf(` `));

const getRandomUniqueElements = (arrayElements, amount) => {
  let subArrayElements = [];
  if (arrayElements.length <= amount) {
    return arrayElements;
  }
  while (subArrayElements.length !== amount) {
    const index = getRandomNumber(arrayElements.length - 1);
    subArrayElements.push(arrayElements[index]);
    arrayElements.splice(index, 1);
  }
  return subArrayElements;
};

const getRandomKey = (collection) => {
  let keys = Array.from(collection.keys());
  return keys[getRandomNumber(keys.length - 1)];
};

export {
  getRandomNumber,
  getRandomElement,
  getFirstWord,
  getRandomUniqueElements,
  getRandomKey
};
