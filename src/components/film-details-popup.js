import {msInMin} from "../consts";
import AbstractSmartComponent from "./abstract-smart-component";
import moment from "moment";

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);
};

const createFilmDetailsTemplate = (film) => {
  const {filmInfo} = film;
  const {release, runtime, poster, ageRating, title, alternativeTitle, totalRating, director, writers, actors, genre, description} = filmInfo;
  const {date: releaseDate, releaseCountry} = release;

  const formattedReleaseDate = moment(releaseDate).format(`DD MMMM YYYY`);
  const formattedRuntime = moment(runtime * msInMin).format(`H[h] m[m]`);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button" tabindex="">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formattedReleaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formattedRuntime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${genre.length !== 1 ? `s` : ``}</td>
                  <td class="film-details__cell">
                    ${createGenresTemplate(genre)}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <ul class="film-details__comments-list"></ul>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsPopup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._closeButtonClickHandler = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeButtonClickHandler = handler;
  }

  setEscKeydownHandler(handler) {
    document.addEventListener(`keydown`, handler);
  }

  removeEscKeydownHandler(handler) {
    document.removeEventListener(`keydown`, handler);
  }
}
