import AbstractComponent from "./abstract-component";
import moment from "moment";

const createFilmCardTemplate = (film) => {
  const {filmInfo} = film;
  const {title, totalRating, genre, poster, description, runtime, release} = filmInfo;
  const {date: releaseDate} = release;
  const releaseYear = moment(releaseDate).format(`YYYY`);
  const shortDescription = description.length > 140 ? description.slice(0, 139) + `…` : description;
  const formattedRuntime = Math.floor(runtime / 60) + `h ` + runtime % 60 + `m`;
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${formattedRuntime}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
    </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  removeLinksToPopupClickHandlers(handler) {
    this.getElement().querySelectorAll(
        `.film-card__title,
        .film-card__poster`
    ).forEach(
        (element) => {
          element.removeEventListener(`click`, handler);
        }
    );
  }

  setLinksToPopupClickHandlers(handler) {
    this.getElement().querySelectorAll(
        `.film-card__title,
        .film-card__poster`
    ).forEach(
        (element) => {
          element.addEventListener(`click`, handler);
        }
    );
  }
}
