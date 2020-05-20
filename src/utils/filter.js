import {FilterType} from "../consts";

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return films;
    case FilterType.HISTORY:
      return films;
    case FilterType.FAVORITES:
      return films;
  }
  return films;
};
