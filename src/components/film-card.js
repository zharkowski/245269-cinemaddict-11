import AbstractComponent from "./abstract-component";

const createFilmCardTemplate = (film) => {
  const {title, rating, releaseDate, runtime, genres, poster, description, comments} = film;
  const releaseYear = releaseDate.getFullYear();
  const shortDescription = description.length > 140 ? description.slice(0, 140) + `...` : description;
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comment${comments.length !== 1 ? `s` : ``}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setLinksToPopupClickHandlers(cb) {
    this.getElement().querySelectorAll(
        `.film-card__title,
        .film-card__poster,
        .film-card__comments`
    ).forEach(
        (element) => {
          element.addEventListener(`click`, cb);
        }
    );
  }
}
