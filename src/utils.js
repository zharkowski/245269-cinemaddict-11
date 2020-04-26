import {RENDER_POSITION} from "./consts";

export const getRandomNumber = (end, start = 0) => Math.floor(start + Math.random() * (end + 1 - start));
export const getRandomElement = (arrayElements) => arrayElements[getRandomNumber(arrayElements.length - 1)];
export const getFirstWord = (str) => str.indexOf(` `) === -1 ? str : str.substr(0, str.indexOf(` `));
export const getRandomUniqueElements = (arrayElements, amount) => {
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

export const getRandomKey = (collection) => {
  let keys = Array.from(collection.keys());
  return keys[getRandomNumber(keys.length - 1)];
};

export const render = (container, element, place) => {
  switch (place) {
    case RENDER_POSITION.AFTERBEGIN:
      container.prepend(element);
      break;
    case RENDER_POSITION.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};
