export default class Film {
  constructor() {
    this._films = null;
  }

  get films() {
    return this._films;
  }

  set films(films) {
    this._films = films;
  }
}
