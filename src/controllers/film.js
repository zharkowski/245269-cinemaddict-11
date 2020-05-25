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

    this._commentsChangeHandler = this._commentsChangeHandler.bind(this);
  }

  _closePopup() {
    this._commentsControllers.forEach((controller) => controller.destroy());
    this._commentsControllers = [];
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

  _removeController(controller) {
    const index = this._commentsControllers.indexOf(controller);
    this._commentsControllers = [].concat(this._commentsControllers.slice(0, index), this._commentsControllers.slice(index + 1));
  }

  // _createComment(commentsComponent) {
  //   this._creatingComment = new CommentsController(commentsComponent, this._commentsModel, this._commentsChangeHandler);
  //   this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  //
  //
  // }

  _commentsChangeHandler(commentController, oldData, newData) {
    if (newData === null) {
      this._removeController(commentController);
      this._commentsModel.removeComment(oldData.id);
      this._commentsDataChangeHandler(this, oldData, newData);
      this._renderComments(this._commentsModel.comments);
    }
    if (oldData === null) {
      //
    }
  }

  _renderComments(comments) {
    const commentsContainer = this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    this._commentsControllers = comments.map((comment) => {
      const commentController = new CommentsController(commentsContainer, this._commentsModel, this._commentsChangeHandler);
      commentController.render(comment);
      return commentController;
    });
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
    document.addEventListener(`keydown`, this._sendCommentKeydownHandler);

    this._renderComments(this._commentsModel.comments);
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
      this._renderComments(this._commentsModel.comments);
    };

    const markAsWatchedClickHandler = () => {
      this._dataChangeHandler(this, film, assignment({}, film, {
        userDetails: {
          alreadyWatched: !film.userDetails.alreadyWatched,
          watchingDate: new Date(),
        }
      }));
      this._renderComments(this._commentsModel.comments);
    };

    const favoriteClickHandler = () => {
      this._dataChangeHandler(this, film, assignment({}, film, {userDetails: {favorite: !film.userDetails.favorite}}));
      this._renderComments(this._commentsModel.comments);
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
