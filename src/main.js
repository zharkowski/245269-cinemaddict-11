import {getProfileElement} from "./components/profile.js";
import {getNavigationElement} from "./components/navigation.js";
import {getSortingElement} from "./components/sorting.js";
import {getBoardsContainer} from "./components/boardsContainer.js";
import {getFilmsBoard} from "./components/filmsBoard.js";
import {getFilmCard} from "./components/filmCard.js";
import {getShowMoreButton} from "./components/showMoreButton.js";
import {getTopRatedBoard} from "./components/topRatedBoard.js";
import {getMostCommented} from "./components/mostCommented.js";
import {getFilmsAmountElement} from "./components/filmsAmountElement.js";
import {getFilmDetailsPopup} from "./components/filmDetailsPopup.js";

const render = (container, markup) => {
  container.insertAdjacentHTML(`beforeend`, markup);
};

const bodyElement = document.querySelector(`body`);
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);

render(headerElement, getProfileElement());
render(mainElement, getNavigationElement());
render(mainElement, getSortingElement());
render(mainElement, getBoardsContainer());

const boardsContainer = mainElement.querySelector(`.films`);

render(boardsContainer, getFilmsBoard());

const filmsList = boardsContainer.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

render(filmsListContainer, getFilmCard());
render(filmsListContainer, getFilmCard());
render(filmsListContainer, getFilmCard());
render(filmsListContainer, getFilmCard());
render(filmsListContainer, getFilmCard());

render(filmsList, getShowMoreButton());

render(boardsContainer, getTopRatedBoard());
render(boardsContainer, getMostCommented());

const topRatedContainer = boardsContainer.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const mostCommentedContainer = boardsContainer.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

render(topRatedContainer, getFilmCard());
render(topRatedContainer, getFilmCard());
render(mostCommentedContainer, getFilmCard());
render(mostCommentedContainer, getFilmCard());

const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
render(footerStatistic, getFilmsAmountElement());

render(bodyElement, getFilmDetailsPopup());
