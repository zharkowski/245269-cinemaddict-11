import AbstractComponent from "./abstract-component";
import moment from "moment";
import {msInMin} from "../consts";

const createFilmCardTemplate = (film) => {
  const {title, rating, releaseDate, runtime, genres, poster, description, comments} = film;
  const releaseYear = moment(releaseDate).format(`YYYY`);
  const shortDescription = description.length > 140 ? description.slice(0, 139) + `…` : description;
  const formattedRuntime = moment(runtime * msInMin).format(`H[h] m[m]`);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${formattedRuntime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comment${comments.length !== 1 ? `s` : ``}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setLinksToPopupClickHandlers(cb) {
    this.getElement().querySelectorAll(
        `.film-card__title,
        .film-card__poster,
        .film-card__comments`
    ).forEach(
        (element) => {
          element.addEventListener(`click`, cb);
        }
    );
  }

  setAddToWatchlistClickHandler(cb) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, cb);
  }

  setMarkAsWatchedClickHandler(cb) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, cb);
  }

  setFavoriteClickHandler(cb) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, cb);
  }
}
