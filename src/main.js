// components
import Profile from "./components/profile";
import Navigation from "./components/navigation";
import FilmAmount from "./components/films-amount-element";
// mocks
import generateFilms from './mocks/film-cards';
// utils
import {render, RenderPosition} from "./utils/render";
// const
import PageController from "./controllers/page";

const FILMS_COUNT = 22;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);

render(headerElement, new Profile(), RenderPosition.BEFOREEND);
render(mainElement, new Navigation(), RenderPosition.BEFOREEND);

const films = generateFilms(FILMS_COUNT);

const pageController = new PageController(mainElement);

pageController.render(films);

const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
render(footerStatistic, new FilmAmount(films.length), RenderPosition.BEFOREEND);
