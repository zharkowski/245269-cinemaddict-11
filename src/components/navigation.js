import generateFilters from '../mocks/filter';
import AbstractComponent from "./abstract-component";

const createFilterTemplate = (filter) => {
  const {title, href, count} = filter;
  return (
    `<a href="#${href}" class="main-navigation__item">
        ${title}
        ${href !== `all` ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFiltersTemplate = (filters) => {
  return filters.map(
      (filter) => {
        return createFilterTemplate(filter);
      }
  ).join(`\n`);
};

const createNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${createFiltersTemplate(generateFilters())}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Navigation extends AbstractComponent {
  getTemplate() {
    return createNavigationTemplate();
  }
}
