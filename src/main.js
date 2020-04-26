import createProfileTemplate from "./components/profile.js";
import createNavigationTemplate from "./components/navigation.js";
import getSortTemplate from "./components/sort.js";
import getBoardsContainer from "./components/boards-container.js";
import getFilmsBoard from "./components/films-board.js";
import createFilmCardMarkup from "./components/film-card.js";
import createShowMoreButtonTemplate from "./components/show-more-button.js";
import createTopRatedBoardTemplate from "./components/top-rated-board.js";
import createMostCommentedBoardTemplate from "./components/most-commented-board.js";
import getFilmsAmountElement from "./components/films-amount-element.js";
import createFilmDetailsTemplate from "./components/film-details-popup.js";
// mocks
import generateFilms from './mocks/film-cards';
// consts
import {KEY} from './consts';

const FILMS_COUNT = 21;
const FIRST_SHOW_FILMS_COUNT = 5;
const ON_BUTTON_CLICK_FILMS_COUNT = 5;
const TOP_RATED_FILMS_COUNT = 2;
const MOST_COMMENT_FILMS_COUNT = 2;

const films = generateFilms(FILMS_COUNT);
const topRatedFilms = generateFilms(TOP_RATED_FILMS_COUNT);
const mostCommentFilms = generateFilms(MOST_COMMENT_FILMS_COUNT);
let showingFilmsCount = FIRST_SHOW_FILMS_COUNT;

const bodyElement = document.querySelector(`body`);
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);

render(headerElement, createProfileTemplate());
render(mainElement, createNavigationTemplate());
render(mainElement, getSortTemplate());
render(mainElement, getBoardsContainer());

const boardsContainer = mainElement.querySelector(`.films`);

render(boardsContainer, getFilmsBoard());

const filmsList = boardsContainer.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

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
  render(bodyElement, createFilmDetailsTemplate(film));
  const popup = document.querySelector(`.film-details`);
  const closeButton = popup.querySelector(`.film-details__close-btn`);
  closeButton.addEventListener(`click`, closePopupClickHandler);
  document.addEventListener(`keydown`, closePopupKeydownHandler);
};

const addEventListenerToFilmCard = (film, filmCard) => {
  const linkToPopupNodes = filmCard.querySelectorAll(
      `.film-card__title,
      .film-card__poster,
      .film-card__comments`
  );
  linkToPopupNodes.forEach((node) => {
    node.addEventListener(`click`, () => {
      openPopup(film);
    });
  });
};

for (let i = 0; i < FIRST_SHOW_FILMS_COUNT; i++) {
  render(filmsListContainer, createFilmCardMarkup(films[i]));
  const filmCard = filmsListContainer.querySelector(`.film-card:nth-child(${i + 1})`);
  addEventListenerToFilmCard(films[i], filmCard);
}

render(filmsList, createShowMoreButtonTemplate());

const showMoreButton = document.querySelector(`.films-list__show-more`);

const showMoreFilms = (currentIndex, filmsAmount) => {
  for (let i = currentIndex; i < currentIndex + filmsAmount; i++) {
    render(filmsListContainer, createFilmCardMarkup(films[i]));
    const filmCard = filmsListContainer.querySelector(`.film-card:nth-child(${i + 1})`);
    addEventListenerToFilmCard(films[i], filmCard);
    showingFilmsCount++;
    if (i >= FILMS_COUNT - 1) {
      showMoreButton.classList.add(`visually-hidden`);
      showMoreButton.removeEventListener(`click`, showMoreButtonClickHandler);
      break;
    }
  }
};

const showMoreButtonClickHandler = () => {
  showMoreFilms(showingFilmsCount, ON_BUTTON_CLICK_FILMS_COUNT);
};

showMoreButton.addEventListener(`click`, showMoreButtonClickHandler);

render(boardsContainer, createTopRatedBoardTemplate());
render(boardsContainer, createMostCommentedBoardTemplate());

const topRatedContainer = boardsContainer.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const mostCommentedContainer = boardsContainer.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

topRatedFilms.forEach((film, index) => {
  render(topRatedContainer, createFilmCardMarkup(film));
  const filmCard = topRatedContainer.querySelector(`.film-card:nth-child(${index + 1})`);
  addEventListenerToFilmCard(film, filmCard);
});

mostCommentFilms.forEach((film, index) => {
  render(mostCommentedContainer, createFilmCardMarkup(film));
  const filmCard = mostCommentedContainer.querySelector(`.film-card:nth-child(${index + 1})`);
  addEventListenerToFilmCard(film, filmCard);
});

const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
render(footerStatistic, getFilmsAmountElement(films.length));
