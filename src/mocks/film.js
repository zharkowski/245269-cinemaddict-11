import {getRandomElement, getRandomUniqueElements, getRandomNumber, getRandomKey, getRandomDate} from '../utils/common';
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
  return {
    id: String(new Date() + Math.random()),
    title: titleKey,
    originalTitle: FILM_TITLES_TO_ORIGINAL_TITLES.get(titleKey),
    poster: getRandomElement(FILM_POSTERS),
    description: getRandomUniqueElements(DESCRIPTION_SENTENCES, DESCRIPTION_SENTENCES_MAX_COUNT).join(` `),
    director: getRandomElement(DIRECTORS),
    writers: getRandomUniqueElements(WRITERS, getRandomNumber(WRITERS.length - 1, 1)),
    actors: getRandomUniqueElements(ACTORS, getRandomNumber(ACTORS.length - 1, 1)),
    comments: new Array(getRandomNumber(5)).fill(``).map(() => String(new Date() + Math.random())),
    rating: getRandomNumber(5, 1),
    releaseDate: getRandomDate(new Date(1895, 1, 25), new Date()),
    runtime: getRandomNumber(300),
    country: getRandomElement(COUNTRIES),
    genres: getRandomUniqueElements(GENRES, getRandomNumber(GENRES.length - 1, 1)),
    ageRating: getRandomElement(AGE_RATINGS),
  };
};

const generateFilms = (amount) => {
  return new Array(amount).fill(``).map(() => generateFilm());
};

export default generateFilms;
