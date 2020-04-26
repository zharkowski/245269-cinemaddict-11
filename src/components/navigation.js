import generateFilters from '../mocks/filter';

const getFilterMarkup = (filter) => {
  const {title, href, count} = filter;
  return (
    `<a href="#${href}" class="main-navigation__item">
        ${title}
        ${href !== `all` ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const getFiltersMarkup = (filters) => {
  return filters.map(
      (filter) => {
        return getFilterMarkup(filter);
      }
  ).join(`\n`);
};

const getNavigationElement = () => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${getFiltersMarkup(generateFilters())}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default getNavigationElement;
