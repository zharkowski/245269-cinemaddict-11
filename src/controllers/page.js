// components
import FilmsBoard from "../components/films-board";
import ShowMoreButton from "../components/show-more-button";
import TopRatedBoard from "../components/top-rated-board";
import MostCommentedBoard from "../components/most-commented-board";
import NoData from "../components/no-data";
import Sort, {SortType} from "../components/sort";
import BoardsContainer from "../components/boards-container";
// utils
import {remove, render, RenderPosition} from "../utils/render";
// controllers
import FilmController from "./film";

const FIRST_SHOW_FILMS_COUNT = 5;
const ON_BUTTON_CLICK_FILMS_COUNT = 5;
const TOP_RATED_FILMS_COUNT = 2;
const MOST_COMMENT_FILMS_COUNT = 2;

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
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
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _viewChangeHandler() {
    this._showingFilmsControllers.forEach((controller) => controller.setDefaultView());
  }

  _dataChangeHandler(filmController, oldFilm, newFilm) {
    const isSuccess = this._filmsModel.updateFilm(oldFilm.id, newFilm);

    if (isSuccess) {
      filmController.render(newFilm);
    }
  }

  _renderFilms(filmsListElement, films) {
    return films.map((film) => {
      const filmController = new FilmController(filmsListElement, this._dataChangeHandler, this._viewChangeHandler);
      filmController.render(film);
      return filmController;
    });
  }

  _renderShowMoreButton() {
    if (this._showingFilmsCount > this._filmsModel.films.length) {
      return;
    }

    const showMoreButtonComponent = this._showMoreButtonComponent;

    const clickHandler = () => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += ON_BUTTON_CLICK_FILMS_COUNT;

      const sortedFilms = getSortedFilms(this._filmsModel.films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const filmsListElement = this._filmsBoardComponent.getElement().querySelector(`.films-list__container`);
      const newFilmControllers = this._renderFilms(filmsListElement, sortedFilms);
      this._showingFilmsControllers = this._showingFilmsControllers.concat(newFilmControllers);

      if (this._showingFilmsCount >= this._filmsModel.films.length) {
        showMoreButtonComponent.getElement().removeEventListener(`click`, clickHandler);
        remove(showMoreButtonComponent);
      }
    };

    const filmsList = this._filmsBoardComponent.getElement();
    render(filmsList, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(clickHandler);
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
    const FilmsControllers = this._renderFilms(filmsListContainerElement, topRatedFilms);
    this._topRatedFilmsControllers = FilmsControllers;
  }

  _renderMostCommentedBoard(boardsContainerElement, films) {
    const mostCommentedBoardComponent = this._mostCommentBoardComponent;
    render(boardsContainerElement, mostCommentedBoardComponent, RenderPosition.BEFOREEND);
    const filmsListContainerElement = mostCommentedBoardComponent.getElement().querySelector(`.films-list__container`);
    const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, MOST_COMMENT_FILMS_COUNT);
    const FilmsControllers = this._renderFilms(filmsListContainerElement, mostCommentedFilms);
    this._mostCommentFilmsControllers = FilmsControllers;
  }

  _sortTypeChangeHandler(sortType) {
    this._showingFilmsCount = FIRST_SHOW_FILMS_COUNT;
    const sortedFilms = getSortedFilms(this._filmsModel.films, sortType, 0, this._showingFilmsCount);
    const filmsListContainerComponent = this._filmsBoardComponent.getElement().querySelector(`.films-list__container`);
    filmsListContainerComponent.innerHTML = ``;
    const newFilmsControllers = this._renderFilms(filmsListContainerComponent, sortedFilms);
    this._showingFilmsControllers = newFilmsControllers;
    this._renderShowMoreButton();
  }

  render() {
    const films = this._filmsModel.films;
    const sortComponent = this._sortComponent;
    const container = this._container;
    render(container, sortComponent, RenderPosition.BEFOREEND);

    const boardsContainerComponent = this._boardsContainer;
    render(container, boardsContainerComponent, RenderPosition.BEFOREEND);
    if (films.length !== 0) {
      this._renderFilmsBoard(boardsContainerComponent.getElement(), films);
    } else {
      render(boardsContainerComponent, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }

    const filmsListContainerElement = container.querySelector(`.films-list__container`);
    this._showingFilmsCount = FIRST_SHOW_FILMS_COUNT;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), 0, this._showingFilmsCount);
    const newFilmsControllers = this._renderFilms(filmsListContainerElement, sortedFilms);
    this._showingFilmsControllers = newFilmsControllers;

    this._renderTopRatedBoard(boardsContainerComponent.getElement(), films);
    this._renderMostCommentedBoard(boardsContainerComponent.getElement(), films);
  }
}
