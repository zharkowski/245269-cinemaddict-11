// components
import FilmComponent from "../components/film";
import FilmDetailsPopup from "../components/film-details-popup";
// controllers
import CommentsController from "./comment";
// consts
import {KEY} from "../consts";
// utils
import {remove, render, RenderPosition, replace} from "../utils/render";
import assignment from "assignment";

export default class FilmController {
  constructor(container, commentsModel, dataChangeHandler, viewChangeHandler, commentsDataChangeHandler) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._commentsDataChangeHandler = commentsDataChangeHandler;

    this._filmComponent = null;
    this._filmDetailsPopupComponent = null;
    this._commentsControllers = [];

    this._closePopup = this._closePopup.bind(this);
    this._closePopupKeydownHandler = this._closePopupKeydownHandler.bind(this);
    // this._commentDataChangeHandler = this._commentDataChangeHandler.bind(this);
  }

  _closePopup() {
    this._commentsControllers.forEach((controller) => controller.destroy());
    this._commentsControllers = [];
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

  _renderComments() {
    const commentsContainer = this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    this._commentsControllers = this._commentsModel.comments.map((comment) => {
      const commentController = new CommentsController(commentsContainer, this._commentsModel, this._commentsDataChangeHandler);
      commentController.render(comment);
      return commentController;
    });
  }

  _removeComments() {
    this._commentsControllers.forEach((taskController) => taskController.destroy());
    this._commentsControllers = [];
  }

  _updateComments() {
    this._removeComments();
    this._renderComments();
  }

  _openPopup() {
    this._viewChangeHandler();

    const container = document.querySelector(`body`);
    render(container, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._closePopupKeydownHandler);

    this._renderComments();
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
    this._filmDetailsPopupComponent = new FilmDetailsPopup(film);
    const filmComponent = this._filmComponent;
    const filmDetailsComponent = this._filmDetailsPopupComponent;

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
    } else {
      render(this._container, filmComponent, RenderPosition.BEFOREEND);
    }
  }
}
