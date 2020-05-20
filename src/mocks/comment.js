import {getRandomDate, getRandomElement} from "../utils/common";
import {COMMENTATOR_NAMES, DESCRIPTION_SENTENCES, EMOTIONS} from "../consts";

const generateComment = (id) => {
  return {
    id,
    text: getRandomElement(DESCRIPTION_SENTENCES),
    emotion: getRandomElement(EMOTIONS),
    author: getRandomElement(COMMENTATOR_NAMES),
    date: getRandomDate(new Date(2020, 4), new Date()),
  };
};

const generateComments = (amount) => {
  return new Array(amount).fill(``).map(generateComment);
};

export default generateComments;
