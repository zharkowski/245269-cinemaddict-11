// components
import Profile from "./components/profile";
import Navigation from "./components/navigation";
import Sort from "./components/sort";
import BoardsContainer from "./components/boards-container";
import FilmsBoard from "./components/films-board";
import FilmCard from "./components/film-card";
import ShowMoreButton from "./components/show-more-button";
import TopRatedBoard from "./components/top-rated-board";
import MostCommentedBoard from "./components/most-commented-board";
import FilmAmount from "./components/films-amount-element";
import FilmDetailsPopup from "./components/film-details-popup";
import Load from "./components/load";
// mocks
import generateFilms from './mocks/film-cards';
// utils
import {render} from "./utils";
// const
import {KEY, RENDER_POSITION} from './consts';

const FILMS_COUNT = 24;
const FIRST_SHOW_FILMS_COUNT = 5;
const ON_BUTTON_CLICK_FILMS_COUNT = 5;
const TOP_RATED_FILMS_COUNT = 2;
const MOST_COMMENT_FILMS_COUNT = 2;

const bodyElement = document.querySelector(`body`);
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);

render(headerElement, new Profile().getElement(), RENDER_POSITION.BEFOREEND);
render(mainElement, new Navigation().getElement(), RENDER_POSITION.BEFOREEND);
render(mainElement, new Sort().getElement(), RENDER_POSITION.BEFOREEND);
render(mainElement, new BoardsContainer().getElement(), RENDER_POSITION.BEFOREEND);

const boardsContainer = mainElement.querySelector(`.films`);

const closePopup = () => {
  const popup = document.querySelector(`.film-details`);
  if (popup) {
    const closeButton = popup.querySelector(`.film-details__close-btn`);
    popup.remove();
    closeButton.removeEventListener(`click`, closePopupClickHandler);
  }
  document.removeEventListener(`keydown`, closePopupKeydownHandler);
};

const closePopupClickHandler = () => {
  closePopup();
};

const closePopupKeydownHandler = (evt) => {
  if (evt.key === KEY.ESC) {
    closePopup();
  }
};

const openPopup = (film) => {
  closePopup();
  render(bodyElement, new FilmDetailsPopup(film).getElement(), RENDER_POSITION.BEFOREEND);
  const popup = document.querySelector(`.film-details`);
  const closeButton = popup.querySelector(`.film-details__close-btn`);
  closeButton.addEventListener(`click`, closePopupClickHandler);
  document.addEventListener(`keydown`, closePopupKeydownHandler);
};

const renderFilm = (filmsListElement, film) => {
  const filmCardComponent = new FilmCard(film);
  const linkToPopupElements = filmCardComponent.getElement().querySelectorAll(
      `.film-card__title,
      .film-card__poster,
      .film-card__comments`
  );
  linkToPopupElements.forEach(
      (element) => {
        element.addEventListener(`click`, () => openPopup(film));
      }
  );

  render(filmsListElement, filmCardComponent.getElement(), RENDER_POSITION.BEFOREEND);
};

const renderFilmsBoard = (boardsContainerElement, films) => {
  render(boardsContainerElement, new FilmsBoard().getElement(), RENDER_POSITION.BEFOREEND);
  const filmsList = boardsContainerElement.querySelector(`.films-list`);
  const filmsListContainerElement = boardsContainerElement.querySelector(`.films-list__container`);

  films.slice(0, FIRST_SHOW_FILMS_COUNT).forEach(
      (film) => renderFilm(filmsListContainerElement, film)
  );
  let showingFilmsCount = FIRST_SHOW_FILMS_COUNT;

  if (showingFilmsCount < films.length) {
    const showMoreButtonComponent = new ShowMoreButton();
    render(filmsList, showMoreButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);

    showMoreButtonComponent.getElement().addEventListener(`click`, () => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount += ON_BUTTON_CLICK_FILMS_COUNT;

      films.slice(prevFilmsCount, showingFilmsCount).forEach(
          (film) => renderFilm(filmsListContainerElement, film)
      );

      if (showingFilmsCount >= films.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.getElement().removeElement();
      }
    });
  }
};

const renderTopRatedBoard = (boardsContainerElement, films) => {
  const topRatedBoardElement = new TopRatedBoard().getElement();
  render(boardsContainerElement, topRatedBoardElement, RENDER_POSITION.BEFOREEND);
  const filmsListContainerElement = topRatedBoardElement.querySelector(`.films-list__container`);
  films.forEach(
      (film) => renderFilm(filmsListContainerElement, film)
  );
};

const renderMostCommentedBoard = (boardsContainerElement, films) => {
  const mostCommentedBoardElement = new MostCommentedBoard().getElement();
  render(boardsContainerElement, mostCommentedBoardElement, RENDER_POSITION.BEFOREEND);
  const filmsListContainerElement = mostCommentedBoardElement.querySelector(`.films-list__container`);
  films.forEach(
      (film) => renderFilm(filmsListContainerElement, film)
  );
};

const films = generateFilms(FILMS_COUNT);
renderFilmsBoard(boardsContainer, films);

const topRatedFilms = generateFilms(TOP_RATED_FILMS_COUNT);
renderTopRatedBoard(boardsContainer, topRatedFilms);

const mostCommentFilms = generateFilms(MOST_COMMENT_FILMS_COUNT);
renderMostCommentedBoard(boardsContainer, mostCommentFilms);

const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
render(footerStatistic, new FilmAmount(films.length).getElement(), RENDER_POSITION.BEFOREEND);
