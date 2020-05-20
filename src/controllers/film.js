import Film from "../components/film";
import {remove, render, RenderPosition} from "../utils/render";
import FilmDetailsPopup from "../components/film-details-popup";
import {KEY} from "../consts";

export default class FilmController {
  constructor(container, dataChangeHandler, viewChangeHandler, commentsModel) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._commentsModel = commentsModel;
    this._filmDetailsPopup = null;

    this._closePopup = this._closePopup.bind(this);
    this._closePopupKeydownHandler = this._closePopupKeydownHandler.bind(this);
  }

  _closePopup() {
    if (this._filmDetailsPopup) {
      remove(this._filmDetailsPopup);
    }
    document.removeEventListener(`keydown`, this._closePopupKeydownHandler);
  }

  _closePopupKeydownHandler(evt) {
    if (evt.key === KEY.ESC) {
      this._closePopup();
    }
  }

  _openPopup(film) {
    this._viewChangeHandler();
    this._filmDetailsPopup = new FilmDetailsPopup(film, this._commentsModel.comments);

    const container = document.querySelector(`body`);
    render(container, this._filmDetailsPopup, RenderPosition.BEFOREEND);
    this._filmDetailsPopup.setCloseButtonClickHandler(this._closePopup);
    document.addEventListener(`keydown`, this._closePopupKeydownHandler);
  }

  setDefaultView() {
    this._closePopup();
  }

  render(film) {
    const filmComponent = new Film(film);
    filmComponent.setLinksToPopupClickHandlers(() => {
      this._openPopup(film);
    });

    filmComponent.setAddToWatchlistClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {isInWatchlist: !film.isInWatchlist}));
    });

    filmComponent.setMarkAsWatchedClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {isWatched: !film.isWatched}));
    });

    filmComponent.setFavoriteClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {isFavorite: !film.isFavorite}));
    });

    render(this._container, filmComponent, RenderPosition.BEFOREEND);
  }
}
