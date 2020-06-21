import Film from "../models/film";
import {nanoid} from "nanoid";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  _isOnline() {
    return window.navigator.onLine;
  }


  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = films.reduce((acc, current) => {
            return Object.assign({}, acc, {
              [current.id]: current,
            });
          }, {});

          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(Film.parseFilms(storeFilms));
  }

  updateFilm(id, data) {
    if (this._isOnline()) {
      return this._api.updateFilm(id, data)
        .then((newFilms) => {
          this._store.setItem(newFilms.id, newFilms.toRAW());

          return newFilms;
        });
    }

    const localFilm = Film.clone(Object.assign(data, {id}));

    this._store.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  getComments(filmId) {
    if (this._isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          const items = comments.reduce((acc, current) => {
            return Object.assign({}, acc, {
              [current.id]: current,
            });
          }, {});

          this._store.setItems(items);
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItems());
    return Promise.resolve(Film.parseFilms(storeComments));
  }

  createComment(filmId, data) {
    if (this._isOnline()) {
      return this._api.createComment(filmId, data)
        .then((comments) => {
          const newComment = comments[comments.length - 1];
          this._store.setItem(newComment.id, newComment.toRAW());

          return comments;
        });
    }

    const localNewCommentId = nanoid();
    const localNewComment = Film.clone(Object.assign(data, {id: localNewCommentId}));

    this._store.setItem(localNewComment.id, localNewComment.toRAW());

    return Promise.resolve(localNewComment);
  }

  deleteComment(id) {
    if (this._isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    return Promise.resolve();
  }
}
