import Film from "../components/film";
import {remove, render, RenderPosition} from "../utils/render";
import FilmDetailsPopup from "../components/film-details-popup";
import {KEY} from "../consts";

export default class FilmController {
  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
  }

  render(film) {
    const openPopup = () => {
      const closePopup = () => {
        remove(filmDetailsPopupComponent);
        document.removeEventListener(`keydown`, closePopupKeydownHandler);
      };

      const filmDetailsPopupComponent = new FilmDetailsPopup(film);

      const closePopupKeydownHandler = (evt) => {
        if (evt.key === KEY.ESC) {
          closePopup();
        }
      };

      const container = document.querySelector(`body`);
      render(container, filmDetailsPopupComponent, RenderPosition.BEFOREEND);
      filmDetailsPopupComponent.setCloseButtonClickHandler(closePopup);
      document.addEventListener(`keydown`, closePopupKeydownHandler);
    };

    const filmComponent = new Film(film);
    filmComponent.setLinksToPopupClickHandlers(() => {
      openPopup(film);
    });

    filmComponent.setAddToWatchlistClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {isInWatchlist: !film.isInWatchlist}));
    });

    filmComponent.setMarkAsWatchedClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {isWatched: !film.isWatched}));
    });

    filmComponent.setFavoriteClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {isFavorite: !film.isFavorite}));
    });

    render(this._container, filmComponent, RenderPosition.BEFOREEND);
  }
}
