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

  updateFilm(id, updatedFilm) {
    const index = this._films.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), updatedFilm, this._films.slice(index + 1));

    return true;
  }
}
