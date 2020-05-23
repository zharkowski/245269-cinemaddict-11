import FilmComponent from "../components/film";
import {remove, render, RenderPosition, replace} from "../utils/render";
import FilmDetailsPopup from "../components/film-details-popup";
import {KEY} from "../consts";
import assignment from "assignment";

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

  _openPopup() {
    this._viewChangeHandler();

    const container = document.querySelector(`body`);
    render(container, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._closePopupKeydownHandler);
  }

  setDefaultView() {
    this._closePopup();
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsPopupComponent);
    document.removeEventListener(`click`, this._closePopupKeydownHandler);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsPopupComponent;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopup(film, this._commentsModel.comments);
    const filmComponent = this._filmComponent;
    const filmDetailsComponent = this._filmDetailsPopupComponent;

    filmComponent.setLinksToPopupClickHandlers(() => {
      this._openPopup(film);
    });

    const addToWatchClickHandler = () => {
      this._dataChangeHandler(this, film, assignment({}, film, {userDetails: {watchlist: !film.userDetails.watchlist}}));
    };

    const markAsWatchedClickHandler = () => {
      this._dataChangeHandler(this, film, assignment({}, film, {
        userDetails: {
          alreadyWatched: !film.userDetails.alreadyWatched,
          watchingDate: new Date(),
        }
      }));
    };

    const favoriteClickHandler = () => {
      this._dataChangeHandler(this, film, assignment({}, film, {userDetails: {favorite: !film.userDetails.favorite}}));
    };

    filmComponent.setAddToWatchlistClickHandler(addToWatchClickHandler);
    filmComponent.setMarkAsWatchedClickHandler(markAsWatchedClickHandler);
    filmComponent.setFavoriteClickHandler(favoriteClickHandler);

    filmDetailsComponent.setAddToWatchlistClickHandler(addToWatchClickHandler);
    filmDetailsComponent.setMarkAsWatchedClickHandler(markAsWatchedClickHandler);
    filmDetailsComponent.setFavoriteClickHandler(favoriteClickHandler);
    filmDetailsComponent.setCloseButtonClickHandler(this._closePopup);

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(filmComponent, oldFilmComponent);
      replace(filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, filmComponent, RenderPosition.BEFOREEND);
    }
  }
}
