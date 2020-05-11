import FilmCard from "../components/film-card";
import {remove, render, RenderPosition} from "../utils/render";
import FilmDetailsPopup from "../components/film-details-popup";
import {KEY} from "../consts";

export default class FilmController {
  constructor(container) {
    this._container = container;
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

      closePopup();
      const container = document.querySelector(`body`);
      render(container, filmDetailsPopupComponent, RenderPosition.BEFOREEND);
      filmDetailsPopupComponent.setCloseButtonClickHandler(closePopup);
      document.addEventListener(`keydown`, closePopupKeydownHandler);
    };

    const filmCardComponent = new FilmCard(film);
    filmCardComponent.setLinksToPopupClickHandlers(() => {
      openPopup(film);
    });

    render(this._container, filmCardComponent, RenderPosition.BEFOREEND);
  }
}
