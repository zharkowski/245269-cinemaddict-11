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

const renderFilms = (filmsListElement, films) => {
  films.forEach(
      (film) => {
        const filmController = new FilmController(filmsListElement);
        filmController.render(film);
      }
  );
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._topRatedBoardComponent = new TopRatedBoard();
    this._sortComponent = new Sort();
    this._mostCommentBoardComponent = new MostCommentedBoard();
    this._noDataComponent = new NoData();
    this._showMoreButtonComponent = new ShowMoreButton();
    this._filmsBoardComponent = new FilmsBoard();
    this._boardsContainer = new BoardsContainer();
  }

  render(films) {
    const renderShowMoreButton = () => {
      if (showingFilmsCount > films.length) {
        return;
      }

      const showMoreButtonComponent = this._showMoreButtonComponent;
      const filmsList = this._filmsBoardComponent.getElement();
      render(filmsList, showMoreButtonComponent, RenderPosition.BEFOREEND);
    };

    const renderFilmsBoard = (boardsContainerElement) => {
      render(boardsContainerElement, this._filmsBoardComponent, RenderPosition.BEFOREEND);

      if (showingFilmsCount < films.length) {
        renderShowMoreButton();
        const showMoreButtonComponent = this._showMoreButtonComponent;
        showMoreButtonComponent.setClickHandler(() => {
          const prevFilmsCount = showingFilmsCount;
          showingFilmsCount += ON_BUTTON_CLICK_FILMS_COUNT;

          const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmsCount, showingFilmsCount);
          renderFilms(filmsListContainerElement, sortedFilms);

          if (showingFilmsCount >= films.length) {
            remove(showMoreButtonComponent);
          }
        });
      }
    };

    const renderTopRatedBoard = (boardsContainerElement) => {
      const topRatedBoardComponent = this._topRatedBoardComponent;
      render(boardsContainerElement, topRatedBoardComponent, RenderPosition.BEFOREEND);
      const filmsListContainerElement = topRatedBoardComponent.getElement().querySelector(`.films-list__container`);
      const topRatedFilms = getSortedFilms(films, SortType.RATING, 0, TOP_RATED_FILMS_COUNT);
      renderFilms(filmsListContainerElement, topRatedFilms);
    };

    const renderMostCommentedBoard = (boardsContainerElement) => {
      const mostCommentedBoardComponent = this._mostCommentBoardComponent;
      render(boardsContainerElement, mostCommentedBoardComponent, RenderPosition.BEFOREEND);
      const filmsListContainerElement = mostCommentedBoardComponent.getElement().querySelector(`.films-list__container`);
      const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, MOST_COMMENT_FILMS_COUNT);
      renderFilms(filmsListContainerElement, mostCommentedFilms);
    };

    const sortComponent = this._sortComponent;
    const container = this._container;
    render(container, sortComponent, RenderPosition.BEFOREEND);
    let showingFilmsCount = FIRST_SHOW_FILMS_COUNT;

    sortComponent.setSortTypeChangeHandler((sortType) => {
      showingFilmsCount = FIRST_SHOW_FILMS_COUNT;
      const sortedFilms = getSortedFilms(films, sortType, 0, showingFilmsCount);
      const filmsListContainerComponent = this._filmsBoardComponent.getElement().querySelector(`.films-list__container`);
      filmsListContainerComponent.innerHTML = ``;
      renderFilms(filmsListContainerComponent, sortedFilms.slice(0, showingFilmsCount));

      renderShowMoreButton();
    });

    const boardsContainerComponent = this._boardsContainer;
    render(container, boardsContainerComponent, RenderPosition.BEFOREEND);
    if (films.length !== 0) {
      renderFilmsBoard(boardsContainerComponent.getElement(), films);
    } else {
      render(boardsContainerComponent, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }

    const filmsListContainerElement = container.querySelector(`.films-list__container`);
    showingFilmsCount = FIRST_SHOW_FILMS_COUNT;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), 0, showingFilmsCount);
    renderFilms(filmsListContainerElement, sortedFilms);

    renderTopRatedBoard(boardsContainerComponent.getElement());

    renderMostCommentedBoard(boardsContainerComponent.getElement());
  }
}
