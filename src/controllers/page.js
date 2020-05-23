// components
import FilmsBoard from "../components/films-board";
import ShowMoreButton from "../components/show-more-button";
import TopRatedBoard from "../components/top-rated-board";
import MostCommentedBoard from "../components/most-commented-board";
import NoData from "../components/no-data";
import Sort, {SortType} from "../components/sort";
import BoardsContainer from "../components/boards-container";
// models
import Comments from "../models/comments";
// utils
import {remove, render, RenderPosition} from "../utils/render";
// controllers
import FilmController, {Mode} from "./film";
// mocks
import generateComments from "../mocks/comment";

const FIRST_SHOW_FILMS_COUNT = 5;
const ON_BUTTON_CLICK_FILMS_COUNT = 5;
const TOP_RATED_FILMS_COUNT = 2;
const MOST_COMMENT_FILMS_COUNT = 2;

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      break;
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

const renderFilms = (filmsListElement, films, dataChangeHandler, viewChangeHandler) => {
  return films.map((film) => {
    const comments = generateComments(film.comments.length);
    const commentsModel = new Comments();
    commentsModel.comments = comments;

    const filmController = new FilmController(filmsListElement, dataChangeHandler, viewChangeHandler, commentsModel);
    filmController.render(film, Mode.DEFAULT);
    return filmController;
  });
};

export default class PageController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._showingFilmsControllers = [];
    this._showingFilmsCount = FIRST_SHOW_FILMS_COUNT;

    this._topRatedBoardComponent = new TopRatedBoard();
    this._sortComponent = new Sort();
    this._mostCommentBoardComponent = new MostCommentedBoard();
    this._noDataComponent = new NoData();
    this._showMoreButtonComponent = new ShowMoreButton();
    this._filmsBoardComponent = new FilmsBoard();
    this._boardsContainer = new BoardsContainer();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._filmsModel.setFilterChangeHandler(this._filterChangeHandler);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _viewChangeHandler() {
    this._showingFilmsControllers.forEach((controller) => controller.setDefaultView());
  }

  _dataChangeHandler(filmController, oldFilm, newFilm) {
    const isSuccess = this._filmsModel.updateFilm(oldFilm.id, newFilm);

    if (isSuccess) {
      filmController.render(newFilm, Mode.DEFAULT);
    }
  }

  _showMoreButtonClickHandler() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount += ON_BUTTON_CLICK_FILMS_COUNT;
    const sortedFilms = getSortedFilms(this._filmsModel.films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
    this._renderFilms(sortedFilms);

    if (this._showingFilmsCount >= this._filmsModel.films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    const showMoreButtonComponent = this._showMoreButtonComponent;
    remove(showMoreButtonComponent);
    if (this._showingFilmsCount > this._filmsModel.films.length || this._filmsModel.films.length <= FIRST_SHOW_FILMS_COUNT) {
      return;
    }

    const filmsList = this._filmsBoardComponent.getElement();
    render(filmsList, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(this._showMoreButtonClickHandler);
  }

  _renderFilmsBoard(boardsContainerElement) {
    render(boardsContainerElement, this._filmsBoardComponent, RenderPosition.BEFOREEND);
    if (this._showingFilmsCount < this._filmsModel.films.length) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedBoard(boardsContainerElement, films) {
    const topRatedBoardComponent = this._topRatedBoardComponent;
    render(boardsContainerElement, topRatedBoardComponent, RenderPosition.BEFOREEND);
    const filmsListContainerElement = topRatedBoardComponent.getElement().querySelector(`.films-list__container`);
    const topRatedFilms = getSortedFilms(films, SortType.RATING, 0, TOP_RATED_FILMS_COUNT);
    renderFilms(filmsListContainerElement, topRatedFilms, this._dataChangeHandler, this._viewChangeHandler);
  }

  _renderMostCommentedBoard(boardsContainerElement, films) {
    const mostCommentedBoardComponent = this._mostCommentBoardComponent;
    render(boardsContainerElement, mostCommentedBoardComponent, RenderPosition.BEFOREEND);
    const filmsListContainerElement = mostCommentedBoardComponent.getElement().querySelector(`.films-list__container`);
    const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, MOST_COMMENT_FILMS_COUNT);
    renderFilms(filmsListContainerElement, mostCommentedFilms, this._dataChangeHandler, this._viewChangeHandler);
  }

  _sortTypeChangeHandler(sortType) {
    const oldShowingFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount = FIRST_SHOW_FILMS_COUNT;
    const sortedFilms = getSortedFilms(this._filmsModel.films, sortType, 0, this._showingFilmsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms);

    if (oldShowingFilmsCount >= this._filmsModel.films.length) {
      this._renderShowMoreButton();
    }
  }

  _renderFilms(films) {
    const filmListElement = this._filmsBoardComponent.getElement().querySelector(`.films-list__container`);
    const newFilms = renderFilms(filmListElement, films, this._dataChangeHandler, this._viewChangeHandler);
    this._showingFilmsControllers = this._showingFilmsControllers.concat(newFilms);
    this._showingFilmsCount = this._showingFilmsControllers.length;
  }

  _removeFilms() {
    this._showingFilmsControllers.forEach((it) => it.destroy());
    this._showingFilmsControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.films.slice(0, count));
    this._renderShowMoreButton();
  }

  _filterChangeHandler() {
    this._updateFilms(FIRST_SHOW_FILMS_COUNT);
  }

  render() {
    const films = this._filmsModel.films;
    const sortComponent = this._sortComponent;
    const container = this._container;
    render(container, sortComponent, RenderPosition.BEFOREEND);

    const boardsContainerComponent = this._boardsContainer;
    render(container, boardsContainerComponent, RenderPosition.BEFOREEND);

    if (films.length === 0) {
      render(boardsContainerComponent, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderFilmsBoard(boardsContainerComponent.getElement(), films);
    this._renderFilms(films.slice(0, this._showingFilmsCount));

    this._renderTopRatedBoard(boardsContainerComponent.getElement(), films);
    this._renderMostCommentedBoard(boardsContainerComponent.getElement(), films);
  }
}
