import AbstractComponent from "./abstract-component";

const SortType = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type=${SortType.DEFAULT}>Sort by ${SortType.DEFAULT}</a></li>
      <li><a href="#" class="sort__button" data-sort-type=${SortType.DATE}>Sort by ${SortType.DATE}</a></li>
      <li><a href="#" class="sort__button" data-sort-type=${SortType.RATING}>Sort by ${SortType.RATING}</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  getTemplate() {
    return createSortTemplate();
  }
}
