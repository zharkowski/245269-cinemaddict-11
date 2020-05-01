// components
import FilmDetailsPopup from "../components/film-details-popup";
import FilmCard from "../components/film-card";
import FilmsBoard from "../components/films-board";
import ShowMoreButton from "../components/show-more-button";
import TopRatedBoard from "../components/top-rated-board";
import MostCommentedBoard from "../components/most-commented-board";
import generateFilms from "../mocks/film-cards";
import NoData from "../components/no-data";
// utils
import {remove, render, RenderPosition} from "../utils/render";
// const
import {KEY} from "../consts";

export default class PageController {
  constructor(container) {
    this._container = container;

    this._topRatedBoardComponent = new TopRatedBoard();
    this._mostCommentBoardComponent = new MostCommentedBoard();
    this._noDataComponent = new NoData();
    this._showMoreButtonComponent = new ShowMoreButton();
    this._filmsBoardComponent = new FilmsBoard();
  }

  render(films) {
    const FIRST_SHOW_FILMS_COUNT = 5;
    const ON_BUTTON_CLICK_FILMS_COUNT = 5;
    const TOP_RATED_FILMS_COUNT = 2;
    const MOST_COMMENT_FILMS_COUNT = 2;

    const openPopup = (film) => {
      const filmDetailsPopupComponent = new FilmDetailsPopup(film);

      const closePopup = () => {
        remove(filmDetailsPopupComponent);
        document.removeEventListener(`keydown`, closePopupKeydownHandler);
      };

      const closePopupKeydownHandler = (evt) => {
        if (evt.key === KEY.ESC) {
          closePopup();
        }
      };

      closePopup();
      render(this._container, filmDetailsPopupComponent, RenderPosition.BEFOREEND);
      filmDetailsPopupComponent.setCloseButtonClickHandler(closePopup);
      document.addEventListener(`keydown`, closePopupKeydownHandler);
    };

    const renderFilm = (filmsListElement, film) => {
      const filmCardComponent = new FilmCard(film);
      filmCardComponent.setLinksToPopupClickHandlers(() => {
        openPopup(film);
      });

      render(filmsListElement, filmCardComponent, RenderPosition.BEFOREEND);
    };

    const renderFilmsBoard = (boardsContainerElement) => {
      render(boardsContainerElement, this._filmsBoardComponent, RenderPosition.BEFOREEND);
      const filmsList = boardsContainerElement.querySelector(`.films-list`);
      const filmsListContainerElement = boardsContainerElement.querySelector(`.films-list__container`);

      films.slice(0, FIRST_SHOW_FILMS_COUNT).forEach(
          (film) => renderFilm(filmsListContainerElement, film)
      );
      let showingFilmsCount = FIRST_SHOW_FILMS_COUNT;

      if (showingFilmsCount < films.length) {
        const showMoreButtonComponent = this._showMoreButtonComponent;
        render(filmsList, showMoreButtonComponent, RenderPosition.BEFOREEND);
        showMoreButtonComponent.setButtonClickHandler(
            () => {
              const prevFilmsCount = showingFilmsCount;
              showingFilmsCount += ON_BUTTON_CLICK_FILMS_COUNT;

              films.slice(prevFilmsCount, showingFilmsCount).forEach(
                  (film) => renderFilm(filmsListContainerElement, film)
              );

              if (showingFilmsCount >= films.length) {
                showMoreButtonComponent.getElement().remove();
              }
            }
        );
      }
    };

    const renderTopRatedBoard = (boardsContainerElement) => {
      const topRatedBoardComponent = this._topRatedBoardComponent;
      render(boardsContainerElement, topRatedBoardComponent, RenderPosition.BEFOREEND);
      const filmsListContainerElement = topRatedBoardComponent.getElement().querySelector(`.films-list__container`);
      const topRatedFilms = films.slice(0, 2);
      topRatedFilms.forEach(
          (film) => renderFilm(filmsListContainerElement, film)
      );
    };

    const renderMostCommentedBoard = (boardsContainerElement) => {
      const mostCommentedBoardComponent = this._mostCommentBoardComponent;
      render(boardsContainerElement, mostCommentedBoardComponent, RenderPosition.BEFOREEND);
      const filmsListContainerElement = mostCommentedBoardComponent.getElement().querySelector(`.films-list__container`);
      const mostCommentedFilms = films.slice(0, 2);
      mostCommentedFilms.forEach(
          (film) => renderFilm(filmsListContainerElement, film)
      );
    };

    if (films.length !== 0) {
      renderFilmsBoard(this._container, films);
    } else {
      render(this._container, this._noDataComponent, RenderPosition.BEFOREEND);
    }

    const topRatedFilms = generateFilms(TOP_RATED_FILMS_COUNT);
    if (films.length !== 0) {
      renderTopRatedBoard(this._container, topRatedFilms);
    }

    const mostCommentFilms = generateFilms(MOST_COMMENT_FILMS_COUNT);
    if (films.length !== 0) {
      renderMostCommentedBoard(this._container, mostCommentFilms);
    }
  }
}
