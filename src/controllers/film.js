// components
import FilmComponent from "../components/film";
import FilmDetailsPopup from "../components/film-details-popup";
import FilmDetailsCommentsCount from "../components/film-details-comments-count";
import FilmDetailsControls from "../components/film-details-controls";
import FilmCommentsCount from "../components/film-comments-count";
import FilmControls from "../components/film-controls";
import NewComment from "../components/new-comment";
// models
import FilmModel from "../models/film";
import CommentModel from "../models/comment";
// controllers
import CommentsController from "./comments";
// consts
import {KEY, SHAKE_ANIMATION_TIMEOUT} from "../consts";
// utils
import {remove, render, RenderPosition, replace} from "../utils/render";

export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class FilmController {
  constructor(container, filmModel, commentsModel, dataChangeHandler, viewChangeHandler, api) {
    this._container = container;
    this._filmModel = filmModel;
    this._commentsModel = commentsModel;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._api = api;
    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._filmCommentsCountComponent = null;
    this._filmControlsComponent = null;

    this._filmDetailsComponent = null;
    this._filmDetailsControlsComponent = null;
    this._filmDetailsCommentsCountComponent = null;
    this._newCommentComponent = null;

    this._commentsController = null;

    this._commentsChangeHandler = this._commentsChangeHandler.bind(this);
    this._closePopupKeydownHandler = this._closePopupKeydownHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._sendCommentKeydownHandler = this._sendCommentKeydownHandler.bind(this);
  }

  _closePopup() {
    if (this._filmDetailsComponent) {
      remove(this._filmDetailsComponent);
    }
    this._filmDetailsComponent.removeEscKeydownHandler(this._closePopupKeydownHandler);
    this._newCommentComponent.removeSendCommentKeydownHandler(this._sendCommentKeydownHandler);
  }

  _closePopupKeydownHandler(evt) {
    if (evt.key === KEY.ESC) {
      this._closePopup();
    }
  }

  _commentsChangeHandler(commentController, oldData, newData) {
    if (newData === null) {
      this._api.deleteComment(oldData.id)
        .then(() => {
          this._commentsController.removeComment(oldData.id);
        })
        .catch(() => {
          commentController.enableDeleteButton(oldData.id);
          this._commentsController.shakeComment(oldData.id);
        });
    }
    if (oldData === null) {
      this._newCommentComponent.removeOutline();
      this._newCommentComponent.disableForm();
      this._api.createComment(this._filmModel.id, newData)
        .then((commentModels) => {
          this._commentsModel.comments = commentModels;
          this._commentsController.render(commentModels);
          this._newCommentComponent.reset();
        })
        .catch(() => {
          this._newCommentComponent.enableForm();
          this.shakeNewComment();
          this._newCommentComponent.addOutline();
        });
    }
    this._renderFilmDetailsCommentsCount();
    this.renderFilmCommentsCount();
  }

  _getAddToWatchlistClickHandler(film) {
    return (evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;
      this._dataChangeHandler(this, film, newFilm);
    };
  }

  _getMarkAsWatchedClickHandler(film) {
    return (evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;
      newFilm.userDetails.watchingDate = new Date();
      this._dataChangeHandler(this, film, newFilm);
    };
  }

  _getFavoriteClickHandler(film) {
    return (evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.userDetails.favorite = !newFilm.userDetails.favorite;
      this._dataChangeHandler(this, film, newFilm);
    };
  }

  renderFilmCommentsCount() {
    const oldFilmCommentsCountComponent = this._filmCommentsCountComponent;
    this._filmCommentsCountComponent = new FilmCommentsCount(this._commentsModel);
    if (oldFilmCommentsCountComponent) {
      replace(this._filmCommentsCountComponent, oldFilmCommentsCountComponent);
    } else {
      render(this._filmComponent.getElement(), this._filmCommentsCountComponent, RenderPosition.BEFOREEND);
    }
    this._filmCommentsCountComponent.setClickHandler(() => this.openPopup());
  }

  _renderFilmDetailsCommentsCount() {
    const oldFilmDetailsCommentsCountComponent = this._filmDetailsCommentsCountComponent;
    this._filmDetailsCommentsCountComponent = new FilmDetailsCommentsCount(this._commentsModel.comments.length);
    const commentsCountContainer = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-wrap`);
    if (oldFilmDetailsCommentsCountComponent) {
      replace(this._filmDetailsCommentsCountComponent, oldFilmDetailsCommentsCountComponent);
    } else {
      render(commentsCountContainer, this._filmDetailsCommentsCountComponent, RenderPosition.AFTERBEGIN);
    }
  }

  renderFilmDetailsControls(film) {
    const oldFilmDetailControlsComponent = this._filmDetailsControlsComponent;
    this._filmDetailsControlsComponent = new FilmDetailsControls(film.userDetails);
    const filmDetailsControlsContainer = this._filmDetailsComponent.getElement().querySelector(`.form-details__top-container`);
    if (oldFilmDetailControlsComponent) {
      replace(this._filmDetailsControlsComponent, oldFilmDetailControlsComponent);
    } else {
      render(filmDetailsControlsContainer, this._filmDetailsControlsComponent, RenderPosition.BEFOREEND);
    }
    this._filmDetailsControlsComponent.setAddToWatchlistClickHandler(this._getAddToWatchlistClickHandler(film));
    this._filmDetailsControlsComponent.setMarkAsWatchedClickHandler(this._getMarkAsWatchedClickHandler(film));
    this._filmDetailsControlsComponent.setFavoriteClickHandler(this._getFavoriteClickHandler(film));
  }

  renderFilmControls(film) {
    const oldFilmControlsComponent = this._filmControlsComponent;
    this._filmControlsComponent = new FilmControls(film.userDetails);
    if (oldFilmControlsComponent) {
      replace(this._filmControlsComponent, oldFilmControlsComponent);
    } else {
      render(this._filmComponent.getElement(), this._filmControlsComponent, RenderPosition.BEFOREEND);
    }
    this._filmControlsComponent.setAddToWatchlistClickHandler(this._getAddToWatchlistClickHandler(film));
    this._filmControlsComponent.setMarkAsWatchedClickHandler(this._getMarkAsWatchedClickHandler(film));
    this._filmControlsComponent.setFavoriteClickHandler(this._getFavoriteClickHandler(film));
  }

  _sendCommentKeydownHandler() {
    const newComment = new CommentModel(this._newCommentComponent.getData());
    this._commentsChangeHandler(this._commentsController, null, newComment);
  }

  shakeNewComment() {
    this._newCommentComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._newCommentComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  renderNewComment() {
    const oldNewCommentComponent = this._newCommentComponent;
    this._newCommentComponent = new NewComment();
    if (oldNewCommentComponent) {
      replace(this._newCommentComponent, oldNewCommentComponent);
    } else {
      const newCommentContainer = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-wrap`);
      render(newCommentContainer, this._newCommentComponent, RenderPosition.BEFOREEND);
    }
    this._newCommentComponent.setSendCommentKeydownHandler(this._sendCommentKeydownHandler);
  }

  setDefaultView() {
    if (this._mode === Mode.DETAILS) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`click`, this._closePopupKeydownHandler);
  }

  openPopup(film) {
    this._viewChangeHandler();

    const container = document.querySelector(`body`);
    render(container, this._filmDetailsComponent, RenderPosition.BEFOREEND);
    this._filmDetailsComponent.setCloseButtonClickHandler(this._closePopup);
    this._filmDetailsComponent.setEscKeydownHandler(this._closePopupKeydownHandler);

    this.renderFilmDetailsControls(film);

    this._renderFilmDetailsCommentsCount();

    this._commentsController.render(this._commentsModel.comments);

    this.renderNewComment();

    this._mode = Mode.DETAILS;
  }

  updateOpenPopupHandler(oldFilm, newFilm) {
    this._filmComponent.removeLinksToPopupClickHandlers(() => this.openPopup(oldFilm));
    this._filmComponent.setLinksToPopupClickHandlers(() => this.openPopup(newFilm));
  }

  render(film, mode) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;
    this._mode = mode;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsComponent = new FilmDetailsPopup(film);
    const filmComponent = this._filmComponent;
    const filmDetailsComponent = this._filmDetailsComponent;

    const commentsContainer = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
    this._commentsController = new CommentsController(commentsContainer, this._commentsModel, this._commentsChangeHandler);

    filmComponent.setLinksToPopupClickHandlers(() => this.openPopup(film));

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(filmComponent, oldFilmComponent);
      this.renderFilmCommentsCount();
      this.renderFilmControls(film);
      replace(filmDetailsComponent, oldFilmDetailsComponent);
      this._commentsController.render(this._commentsModel.comments);
    } else {
      render(this._container, filmComponent, RenderPosition.BEFOREEND);
      this.renderFilmCommentsCount();
      this.renderFilmControls(film);
    }
  }
}
