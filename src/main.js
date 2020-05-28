// components
import Profile from "./components/profile";
import Navigation from "./components/navigation";
import FilmAmount from "./components/films-amount-element";
import Statistic from "./components/statistic";
// controllers
import FilterController from "./controllers/filter";
import PageController from "./controllers/page";
// models
import Films from "./models/films";
// mocks
import generateFilms from './mocks/film';
// utils
import {render, RenderPosition} from "./utils/render";

const FILMS_COUNT = 17;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);

const navigationComponent = new Navigation();
render(headerElement, new Profile(), RenderPosition.BEFOREEND);
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);

const films = generateFilms(FILMS_COUNT);
const filmsModel = new Films();
filmsModel.allFilms = films;

const filtersContainer = navigationComponent.getElement();
const filterController = new FilterController(filtersContainer, filmsModel);
filterController.render();

const pageController = new PageController(mainElement, filmsModel);
pageController.render();

const statisticComponent = new Statistic();
render(mainElement, statisticComponent, RenderPosition.BEFOREEND);

const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
render(footerStatistic, new FilmAmount(films.length), RenderPosition.BEFOREEND);
