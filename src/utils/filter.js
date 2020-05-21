import {FilterType} from "../consts";

const getWatchlistFilms = (films) => films.filter((film) => film.userDetails.watchlist);
const getHistoryFilms = (films) => films.filter((film) => film.userDetails.alreadyWatched);
const getFavoritesFilms = (films) => films.filter((film) => film.userDetails.favorite);

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getHistoryFilms(films);
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
  }
  return films;
};
