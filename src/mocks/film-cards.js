import {getRandomElement, getRandomUniqueElements, getRandomNumber, getRandomKey} from '../utils';
import {
  FILM_TITLES_TO_ORIGINAL_TITLES,
  FILM_POSTERS,
  DESCRIPTION_SENTENCES,
  EMOTIONS,
  MONTH_NAMES,
  DIRECTORS,
  WRITERS,
  COMMENTATOR_NAMES,
  ACTORS,
  COUNTRIES,
  GENRES,
  AGE_RATINGS,
} from '../consts';

const DESCRIPTION_MAX_VALUE = 5;

const generateComment = () => {
  return {
    text: getRandomElement(DESCRIPTION_SENTENCES),
    emotion: getRandomElement(EMOTIONS),
    author: getRandomElement(COMMENTATOR_NAMES),
    date: `2019/12/31 23:59`
  };
};

const generateComments = (amount) => {
  return new Array(amount).fill(``).map(generateComment);
};

const generateFilm = () => {
  const titleKey = getRandomKey(FILM_TITLES_TO_ORIGINAL_TITLES);
  return {
    title: titleKey,
    originalTitle: FILM_TITLES_TO_ORIGINAL_TITLES.get(titleKey),
    poster: getRandomElement(FILM_POSTERS),
    description: getRandomUniqueElements(DESCRIPTION_SENTENCES, DESCRIPTION_MAX_VALUE).join(` `),
    director: getRandomElement(DIRECTORS),
    writers: getRandomUniqueElements(WRITERS, getRandomNumber(WRITERS.length - 1, 1)),
    actors: getRandomUniqueElements(ACTORS, getRandomNumber(ACTORS.length - 1, 1)),
    comments: generateComments(getRandomNumber(5)),
    rating: getRandomNumber(5, 1),
    releaseDate: getRandomNumber(31, 1) + ` ` + getRandomElement(MONTH_NAMES) + ` ` + getRandomNumber(2020, 1895),
    runtime: getRandomNumber(10, 0) + `h ` + getRandomNumber(59, 0) + `m`,
    country: getRandomElement(COUNTRIES),
    genres: getRandomUniqueElements(GENRES, getRandomNumber(GENRES.length - 1, 1)),
    ageRating: getRandomElement(AGE_RATINGS),
  };
};

const generateFilms = (amount) => {
  return new Array(amount).fill(``).map(() => generateFilm());
};

export default generateFilms;
