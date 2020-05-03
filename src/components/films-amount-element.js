import AbstractComponent from "./abstract-component";

const createFilmsAmountTemplate = (amount) => {
  return (
    `<p>${amount} movie${amount !== 1 ? `s` : ``} inside</p>`
  );
};

export default class FilmAmount extends AbstractComponent {
  constructor(amount) {
    super();
    this._amount = amount;
  }

  getTemplate() {
    return createFilmsAmountTemplate(this._amount);
  }
}
