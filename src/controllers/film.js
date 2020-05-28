// components
import FilmComponent from "../components/film";
import FilmDetailsPopup from "../components/film-details-popup";
import FilmDetailsCommentsCount from "../components/film-details-comments-count";
// controllers
import CommentsController from "./comments";
// consts
import {KEY} from "../consts";
// utils
import {remove, render, RenderPosition, replace} from "../utils/render";
import assignment from "assignment";
import FilmDetailsControls from "../components/film-details-controls";
import FilmCommentsCount from "../components/film-comments-count";
import FilmControls from "../components/film-controls";
import NewComment from "../components/new-comment";

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
  }

  _closePopup() {
    if (this._filmDetailsComponent) {
      remove(this._filmDetailsComponent);
    }
    this._filmDetailsComponent.removeEscKeydownHandler(this._closePopupKeydownHandler);
    // document.removeEventListener(`keydown`, this._sendCommentKeydownHandler);
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
      this._commentsController.addComment(newData);
    }
    this._renderFilmDetailsCommentsCount();
    this.renderFilmCommentsCount();
  }

  // _sendCommentKeydownHandler(evt) {
  //   if (evt.key === KEY.ENTER || (evt[KEY.LEFT_COMMAND] || evt[KEY.LEFT_COMMAND] || evt[KEY.RIGHT_COMMAND]
  //       || evt[KEY.LEFT_CTRL] || evt[KEY.RIGHT_CTRL])) {
  //     console.log(`jija`);
  //   }
  // }

  _getAddToWatchlistClickHandler(film) {
    return (evt) => {
      evt.preventDefault();
      const newFilm = assignment({}, film, {userDetails: {watchlist: !film.userDetails.watchlist}});
      this._dataChangeHandler(this, film, newFilm);
    };
  }

  _getMarkAsWatchedClickHandler(film) {
    return (evt) => {
      evt.preventDefault();
      const newFilm = assignment({}, film, {
        userDetails: {
          alreadyWatched: !film.userDetails.alreadyWatched,
          watchingDate: new Date(),
        }
      });
      this._dataChangeHandler(this, film, newFilm);
    };
  }

  _getFavoriteClickHandler(film) {
    return (evt) => {
      evt.preventDefault();
      const newFilm = assignment({}, film, {userDetails: {favorite: !film.userDetails.favorite}});
      this._dataChangeHandler(this, film, newFilm);
    };
  }

  renderFilmCommentsCount() {
    const oldFilmCommentsCountComponent = this._filmCommentsCountComponent;
    this._filmCommentsCountComponent = new FilmCommentsCount(this._commentsModel.comments.length);
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

  renderNewComment() {
    const oldNewCommentComponent = this._newCommentComponent;
    this._newCommentComponent = new NewComment();
    if (oldNewCommentComponent) {
      replace(this._newCommentComponent, oldNewCommentComponent);
    } else {
      const newCommentContainer = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-wrap`);
      render(newCommentContainer, this._newCommentComponent, RenderPosition.BEFOREEND);
    }
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
    // document.addEventListener(`keydown`, this._sendCommentKeydownHandler);
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
