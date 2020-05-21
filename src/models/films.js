import {getFilmsByFilter} from "../utils/filter";

export default class Films {
  constructor() {
    this._films = null;
    this._activeFilterType = null;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  get films() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  get allFilms() {
    return this._films;
  }

  set allFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDateChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  updateFilm(id, updatedFilm) {
    const index = this.allFilms.findIndex((film) => film.id === id);
    if (index === -1) {
      return false;
    }

    this.allFilms = [].concat(this.allFilms.slice(0, index), updatedFilm, this.allFilms.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }
}
