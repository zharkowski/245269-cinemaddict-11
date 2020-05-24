import {getRandomDate, getRandomElement} from "../utils/common";
import {COMMENTATOR_NAMES, DESCRIPTION_SENTENCES, EMOTIONS} from "../consts";

const generateComment = (commentId) => {
  return {
    id: commentId,
    comment: getRandomElement(DESCRIPTION_SENTENCES),
    emotion: getRandomElement(EMOTIONS),
    author: getRandomElement(COMMENTATOR_NAMES),
    date: getRandomDate(new Date(2020, 4), new Date()),
  };
};

const generateComments = (ids) => {
  return new Array(ids.length).fill(``).map((_, index) => generateComment(ids[index]));
};

export default generateComments;
