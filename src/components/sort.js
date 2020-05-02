import AbstractComponent from "./abstract-component";

export const SortType = {
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
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      if (sortType === this.getSortType()) {
        return;
      }

      const currentSortElement = this.getElement().querySelector(`[data-sort-type=${this.getSortType()}]`);
      currentSortElement.classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);
      this._currentSortType = sortType;
      handler(this.getSortType());
    });
  }
}
