import API from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider";
// components
import Profile from "./components/profile";
import Navigation from "./components/navigation";
import FilmAmount from "./components/films-amount-element";
import Statistic from "./components/statistic";
import Load from "./components/load";
import SortComponent from "./components/sort";
import NoDataComponent from "./components/no-data";
// controllers
import FilterController from "./controllers/filter";
import PageController from "./controllers/page";
// models
import Films from "./models/films";
// utils
import {remove, render, RenderPosition} from "./utils/render";
// consts
import {MenuItem} from "./consts";
import BoardsContainer from "./components/boards-container";

const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const AUTHORIZATION = `Basic eo04ik2989a`;
const STORE_PREFIX = `cinemadict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new Films();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const headerFooter = document.querySelector(`.footer`);
const navigationComponent = new Navigation();
const filtersContainer = navigationComponent.getElement();
const filterController = new FilterController(filtersContainer, filmsModel);
const sortComponent = new SortComponent();
const boardsContainerComponent = new BoardsContainer();
const pageController = new PageController(boardsContainerComponent.getElement(), filmsModel, sortComponent, apiWithProvider);
const statisticComponent = new Statistic({films: filmsModel});
const loadComponent = new Load();
const footerStatistic = headerFooter.querySelector(`.footer__statistics`);
const profileComponent = new Profile(filmsModel);
const filmAmountComponent = new FilmAmount(filmsModel);

render(headerElement, profileComponent, RenderPosition.BEFOREEND);
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);
filterController.render();
render(mainElement, sortComponent, RenderPosition.BEFOREEND);
render(mainElement, boardsContainerComponent, RenderPosition.BEFOREEND);
render(boardsContainerComponent.getElement(), loadComponent, RenderPosition.BEFOREEND);
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

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.allFilms = films;
    remove(loadComponent);
    if (films.length !== 0) {
      pageController.render();
      profileComponent.rerender();
      filmAmountComponent.rerender();
    } else {
      const noDataComponent = new NoDataComponent();
      render(boardsContainerComponent.getElement(), noDataComponent, RenderPosition.BEFOREEND);
    }
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/serviceWorker.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
