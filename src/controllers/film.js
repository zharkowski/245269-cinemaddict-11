import FilmComponent from "../components/film";
import {remove, render, RenderPosition} from "../utils/render";
import FilmDetailsPopup from "../components/film-details-popup";
import {KEY} from "../consts";

export default class FilmController {
  constructor(container, dataChangeHandler, viewChangeHandler, commentsModel) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._commentsModel = commentsModel;
    this._filmComponent = null;
    this._filmDetailsPopupComponent = null;

    this._closePopup = this._closePopup.bind(this);
    this._closePopupKeydownHandler = this._closePopupKeydownHandler.bind(this);
  }

  _closePopup() {
    if (this._filmDetailsPopupComponent) {
      remove(this._filmDetailsPopupComponent);
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
    this._filmDetailsPopupComponent = new FilmDetailsPopup(film, this._commentsModel.comments);

    const container = document.querySelector(`body`);
    render(container, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    this._filmDetailsPopupComponent.setCloseButtonClickHandler(this._closePopup);
    document.addEventListener(`keydown`, this._closePopupKeydownHandler);
  }

  setDefaultView() {
    this._closePopup();
  }

  destroy() {
    remove(this._filmComponent);
  }

  render(film) {
    this._filmComponent = new FilmComponent(film);
    const filmComponent = this._filmComponent;
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
