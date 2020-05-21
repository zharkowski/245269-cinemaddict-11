import AbstractComponent from "./abstract-component";
import moment from "moment";
import {msInMin} from "../consts";

const createFilmCardTemplate = (film) => {
  const {filmInfo, comments, userDetails} = film;
  const {title, totalRating, genre, poster, description, runtime, release} = filmInfo;
  const {date: releaseDate} = release;
  const {watchlist, alreadyWatched, favorite} = userDetails;
  const releaseYear = moment(releaseDate).format(`YYYY`);
  const shortDescription = description.length > 140 ? description.slice(0, 139) + `…` : description;
  const formattedRuntime = moment(runtime * msInMin).format(`H[h] m[m]`);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${formattedRuntime}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comment${comments.length !== 1 ? `s` : ``}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${alreadyWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
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
