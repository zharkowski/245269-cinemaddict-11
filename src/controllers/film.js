// components
import FilmComponent from "../components/film";
import FilmDetailsPopup from "../components/film-details-popup";
// controllers
import CommentsController from "./comments";
// consts
import {KEY} from "../consts";
// utils
import {remove, render, RenderPosition, replace} from "../utils/render";
import assignment from "assignment";

export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class FilmController {
  constructor(container, commentsModel, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._filmDetailsPopupComponent = null;

    this._commentsController = null;

    this._commentsChangeHandler = this._commentsChangeHandler.bind(this);
    this._closePopupKeydownHandler = this._closePopupKeydownHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  _closePopup() {
    if (this._filmDetailsPopupComponent) {
      remove(this._filmDetailsPopupComponent);
    }
    document.removeEventListener(`keydown`, this._closePopupKeydownHandler);
    document.removeEventListener(`keydown`, this._sendCommentKeydownHandler);
  }

  _closePopupKeydownHandler(evt) {
    if (evt.key === KEY.ESC) {
      this._closePopup();
    }
  }

  _commentsChangeHandler(commentController, oldData, newData) {
    if (newData === null) {
      this._commentsController.removeComment(oldData.id);
    }
    if (oldData === null) {
      //
    }
  }

  _sendCommentKeydownHandler(evt) {
    if (evt.key === KEY.ENTER || (evt[KEY.LEFT_COMMAND] || evt[KEY.LEFT_COMMAND] || evt[KEY.RIGHT_COMMAND]
        || evt[KEY.LEFT_CTRL] || evt[KEY.RIGHT_CTRL])) {
      //
    }
  }

  _openPopup() {
    this._viewChangeHandler();

    const container = document.querySelector(`body`);
    render(container, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._closePopupKeydownHandler);

    this._commentsController.render(this._commentsModel.comments);

    document.addEventListener(`keydown`, this._sendCommentKeydownHandler);
    this._mode = Mode.DETAILS;
  }

  setDefaultView() {
    if (this._mode === Mode.DETAILS) {
      this._closePopup();
    }
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
    this._filmDetailsPopupComponent = new FilmDetailsPopup(film);
    const filmComponent = this._filmComponent;
    const filmDetailsComponent = this._filmDetailsPopupComponent;

    const commentsContainer = this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    this._commentsController = new CommentsController(commentsContainer, this._commentsModel, this._commentsChangeHandler);

    filmComponent.setLinksToPopupClickHandlers(() => {
      this._openPopup();
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
      this._commentsController.render(this._commentsModel.comments);
    } else {
      render(this._container, filmComponent, RenderPosition.BEFOREEND);
    }
  }
}
