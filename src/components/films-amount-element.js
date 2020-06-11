import AbstractSmartComponent from "./abstract-smart-component";

const createFilmsAmountTemplate = (amount) => {
  return (
    `<p>${amount} movie${amount !== 1 ? `s` : ``} inside</p>`
  );
};

export default class FilmAmount extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
  }

  getTemplate() {
    return createFilmsAmountTemplate(this._filmsModel.films.length);
  }

  recoveryListeners() {}
}
