import AbstractComponent from "./abstract-component";

const createFilmControlsTemplate = (userDetails) => {
  const {watchlist, alreadyWatched, favorite} = userDetails;
  return (
    `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${alreadyWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
    </form>`
  );
};

export default class FilmControls extends AbstractComponent {
  constructor(userDetails) {
    super();
    this._userDetails = userDetails;
  }

  getTemplate() {
    return createFilmControlsTemplate(this._userDetails);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setMarkAsWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}
