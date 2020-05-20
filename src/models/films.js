import {getFilmsByFilter} from "../utils/filter";

export default class Films {
  constructor() {
    this._films = null;
    this._activeFilterType = null;
  }

  get films() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  get allFilms() {
    return this._films;
  }

  set allFilms(films) {
    this._films = films;
  }

  updateFilm(id, updatedFilm) {
    const index = this.allFilms.findIndex((film) => film.id === id);
    if (index === -1) {
      return false;
    }

    this.allFilms = [].concat(this.allFilms.slice(0, index), updatedFilm, this.allFilms.slice(index + 1));

    return true;
  }
}
