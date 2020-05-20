// components
import Profile from "./components/profile";
import Navigation from "./components/navigation";
import FilmAmount from "./components/films-amount-element";
// models
import Films from "./models/films";
// mocks
import generateFilms from './mocks/film';
// utils
import {render, RenderPosition} from "./utils/render";
// const
import PageController from "./controllers/page";

const FILMS_COUNT = 17;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);

render(headerElement, new Profile(), RenderPosition.BEFOREEND);
render(mainElement, new Navigation(), RenderPosition.BEFOREEND);

const films = generateFilms(FILMS_COUNT);
const filmsModel = new Films();
filmsModel.films = films;

const pageController = new PageController(mainElement, filmsModel);

pageController.render();

const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
render(footerStatistic, new FilmAmount(films.length), RenderPosition.BEFOREEND);
