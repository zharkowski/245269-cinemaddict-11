import {
  getRandomElement,
  getRandomUniqueElements,
  getRandomNumber,
  getRandomKey,
  getRandomDate,
  getRandomBoolean,
} from '../utils/common';
import {
  FILM_TITLES_TO_ORIGINAL_TITLES,
  FILM_POSTERS,
  DESCRIPTION_SENTENCES,
  DIRECTORS,
  WRITERS,
  ACTORS,
  COUNTRIES,
  GENRES,
  AGE_RATINGS,
} from '../consts';

const DESCRIPTION_SENTENCES_MAX_COUNT = 5;

const generateFilm = () => {
  const titleKey = getRandomKey(FILM_TITLES_TO_ORIGINAL_TITLES);
  const releaseDate = getRandomDate(new Date(1895, 1, 25), new Date());
  return {
    id: String(new Date() + Math.random()),
    comments: new Array(getRandomNumber(5)).fill(``).map(() => String(new Date() + Math.random())),
    filmInfo: {
      title: titleKey,
      alternativeTitle: FILM_TITLES_TO_ORIGINAL_TITLES.get(titleKey),
      totalRating: getRandomNumber(5, 1),
      poster: `images/posters/` + getRandomElement(FILM_POSTERS),
      ageRating: getRandomElement(AGE_RATINGS),
      director: getRandomElement(DIRECTORS),
      writers: getRandomUniqueElements(WRITERS, getRandomNumber(WRITERS.length - 1, 1)),
      actors: getRandomUniqueElements(ACTORS, getRandomNumber(ACTORS.length - 1, 1)),
      release: {
        date: releaseDate,
        releaseCountry: getRandomElement(COUNTRIES),
      },
      runtime: getRandomNumber(300),
      genre: getRandomUniqueElements(GENRES, getRandomNumber(GENRES.length - 1, 1)),
      description: getRandomUniqueElements(DESCRIPTION_SENTENCES, DESCRIPTION_SENTENCES_MAX_COUNT).join(` `),
    },
    userDetails: {
      watchlist: getRandomBoolean(),
      alreadyWatched: getRandomBoolean(),
      watchingDate: getRandomDate(new Date(2019, 1, 1), new Date()),
      favorite: getRandomBoolean(),
    },
  };
};

const generateFilms = (amount) => {
  return new Array(amount).fill(``).map(() => generateFilm());
};

export default generateFilms;
