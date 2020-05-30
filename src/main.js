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
import {getAlreadyWatchedFilmsCount} from "./utils/common";
// consts
import {MenuItem} from "./consts";

const FILMS_COUNT = 17;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);
const filmsModel = new Films();
filmsModel.allFilms = films;

const navigationComponent = new Navigation();
render(headerElement, new Profile(getAlreadyWatchedFilmsCount(films)), RenderPosition.BEFOREEND);
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);

const filtersContainer = navigationComponent.getElement();
const filterController = new FilterController(filtersContainer, filmsModel);
filterController.render();

const pageController = new PageController(mainElement, filmsModel);
pageController.render();

const statisticComponent = new Statistic(films);
render(mainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

navigationComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.ALL_MOVIES:
      statisticComponent.hide();
      pageController.show();
      break;
    case MenuItem.WATCHLIST:
      statisticComponent.hide();
      pageController.show();
      break;
    case MenuItem.HISTORY:
      statisticComponent.hide();
      pageController.show();
      break;
    case MenuItem.FAVORITES:
      statisticComponent.hide();
      pageController.show();
      break;
    case MenuItem.STATISTIC:
      pageController.hide();
      statisticComponent.show();
      break;
  }
});

const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
render(footerStatistic, new FilmAmount(films.length), RenderPosition.BEFOREEND);
