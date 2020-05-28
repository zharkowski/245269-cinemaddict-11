import {FilterType} from "../consts";
import {getFilmsByFilter} from "../utils/filter";
import FilterComponent from "../components/filter";
import {render, RenderPosition, replace} from "../utils/render";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._filterComponent = null;
    this._activeFilterType = FilterType.ALL;

    this.filterChangeHandler = this.filterChangeHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);

    this._filmsModel.setDateChangeHandler(this._dataChangeHandler);
  }

  filterChangeHandler(filterType) {
    this._activeFilterType = filterType;
    this._filmsModel.setFilter(filterType);
    this.render();
    // console.log(this._filmsModel.setDefaultSortType);
    // this._filmsModel.setDefaultSortType();
  }

  _dataChangeHandler() {
    this.render();
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.allFilms;

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        type: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this.filterChangeHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }
}
