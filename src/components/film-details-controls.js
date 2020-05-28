import AbstractComponent from "./abstract-component";

const createFilmDetailsControlsTemplate = (userDetails) => {
  const {watchlist, alreadyWatched, favorite} = userDetails;
  return (
    `<section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatched ? `checked` : ``}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? `checked` : ``}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>`
  );
};

export default class FilmDetailsControls extends AbstractComponent {
  constructor(userDetails) {
    super();

    this._userDetails = userDetails;
  }

  getTemplate() {
    return createFilmDetailsControlsTemplate(this._userDetails);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
  }

  setMarkAsWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
  }
}
