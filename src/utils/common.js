import {Rating} from "../consts";

export const getRandomNumber = (end, start = 0) => Math.floor(start + Math.random() * (end + 1 - start));
export const getRandomBoolean = () => Math.random() >= 0.5;
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

export const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const getAlreadyWatchedFilmsCount = (films) => {
  const alreadyWatchedFilms = films.filter((film) => film.userDetails.alreadyWatched);
  return alreadyWatchedFilms.length;
};

export const getRating = (filmsCount) => {
  if (filmsCount <= 10) {
    return Rating.NOVICE;
  } else if (filmsCount > 10 && filmsCount <= 20) {
    return Rating.FAN;
  } else if (filmsCount > 20) {
    return Rating.MOVIE_BUFF;
  }
  return ``;
};
