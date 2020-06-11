import API from "./api";
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
// utils
import {render, RenderPosition} from "./utils/render";
// consts
import {MenuItem} from "./consts";

const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;
const AUTHORIZATION = `Basic eo0w12344ik29889a`;

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new Films();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);
const navigationComponent = new Navigation();
const filtersContainer = navigationComponent.getElement();
const filterController = new FilterController(filtersContainer, filmsModel);
const pageController = new PageController(mainElement, filmsModel);
const statisticComponent = new Statistic({films: filmsModel});
const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
const profileComponent = new Profile(filmsModel);
const filmAmountComponent = new FilmAmount(filmsModel);

render(headerElement, profileComponent, RenderPosition.BEFOREEND);
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);
filterController.render();

render(mainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();
render(footerStatistic, filmAmountComponent, RenderPosition.BEFOREEND);

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

api.getFilms()
  .then((films) => {
    filmsModel.allFilms = films;
    pageController.render();
    profileComponent.rerender();
    filmAmountComponent.rerender();
  });
