import {createElement} from "../utils";

const createFilmsAmountTemplate = (amount) => {
  return (
    `<p>${amount} movie${amount !== 1 ? `s` : ``} inside</p>`
  );
};

export default class FilmCard {
  constructor(amount) {
    this._amount = amount;
    this._element = null;
  }

  getTemplate() {
    return createFilmsAmountTemplate(this._amount);
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
