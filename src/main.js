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

const films = generateFilms(FILMS_COUNT);
const filmsModel = new Films();
filmsModel.allFilms = films;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);
const navigationComponent = new Navigation();
const filtersContainer = navigationComponent.getElement();
const filterController = new FilterController(filtersContainer, filmsModel);
const pageController = new PageController(mainElement, filmsModel);
const statisticComponent = new Statistic(filmsModel);
const footerStatistic = headerFooter.querySelector(`.footer__statistics`);

render(headerElement, new Profile(getAlreadyWatchedFilmsCount(films)), RenderPosition.BEFOREEND);
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);
filterController.render();
pageController.render();
render(mainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();
render(footerStatistic, new FilmAmount(films.length), RenderPosition.BEFOREEND);

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
