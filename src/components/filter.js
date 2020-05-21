import AbstractComponent from "./abstract-component";
import {FilterTypeToName} from "../consts";

const FILTER_HREF_PREFIX = `#`;

const createFilterTemplate = (filter) => {
  const {type, count, checked} = filter;
  const name = FilterTypeToName[type];
  return (
    `<a href="#${type}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}">
        ${name}
        ${type !== `all` ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFiltersTemplate = (filters) => {
  return (
    `<div class="main-navigation__items">
      ${filters.map((filter) => createFilterTemplate(filter)).join(`\n`)}
    </div>`
  );
};

const getFilterTypeByHref = (href) => href.substring(FILTER_HREF_PREFIX.length);

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((it) => it.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const filterType = getFilterTypeByHref(it.getAttribute(`href`));
        handler(filterType);
      }));
  }
}
