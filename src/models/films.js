export default class Films {
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
    const index = this.films.findIndex((film) => film.id === id);
    if (index === -1) {
      return false;
    }

    this.films = [].concat(this.films.slice(0, index), updatedFilm, this.films.slice(index + 1));

    return true;
  }
}
