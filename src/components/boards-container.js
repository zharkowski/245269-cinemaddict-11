import {createElement} from "../utils";

const createBoardTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class BoardsContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createBoardTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
