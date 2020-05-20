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

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }
}
