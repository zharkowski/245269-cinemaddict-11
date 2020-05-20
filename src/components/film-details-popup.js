import {EMOTIONS, msInMin} from "../consts";
import AbstractSmartComponent from "./abstract-smart-component";
import moment from "moment";

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);
};

const createCommentTemplate = (comment) => {
  const {text, emotion, author, date} = comment;
  const formattedDate = moment(date).fromNow();
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsTemplate = (comments) => {
  return comments.map((comment) => createCommentTemplate(comment)).join(`\n`);
};

const createEmotionsTemplate = (activeEmoji) => {
  return EMOTIONS.map(
      (emotion) => {
        return (
          `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${emotion === activeEmoji ? `checked=""` : ``}>
          <label class="film-details__emoji-label" for="emoji-${emotion}">
            <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
          </label>`
        );
      }
  ).join(`\n`);
};

const createFilmDetailsTemplate = (film, comments, options) => {
  const {
    poster,
    ageRating,
    title,
    originalTitle,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    country,
    genres,
    description,
  } = film;
  const {
    activeEmoji
  } = options;

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
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
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
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${genres.length !== 1 ? `s` : ``}</td>
                  <td class="film-details__cell">
                    ${createGenresTemplate(genres)}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comment${comments.length !== 1 ? `s` : ``}
              <span class="film-details__comments-count">${comments.length}</span>
            </h3>

            <ul class="film-details__comments-list">
              ${createCommentsTemplate(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${activeEmoji ? `<img src="images/emoji/${activeEmoji}.png" alt="emoji-${activeEmoji}" width="55" height="55">` : ``}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${createEmotionsTemplate(activeEmoji)}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsPopup extends AbstractSmartComponent {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._activeEmoji = null;
    this._closeButtonClickHandler = null;

    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const emojiButtons = element.querySelectorAll(`.film-details__emoji-item`);
    emojiButtons.forEach((button) => {
      button.addEventListener(`click`, () => {
        this._activeEmoji = button.value;
        this.rerender();
      });
    });
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._comments, {activeEmoji: this._activeEmoji});
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this._subscribeOnEvents();
  }

  setCloseButtonClickHandler(cb) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, cb);
    this._closeButtonClickHandler = cb;
  }

  setAddToWatchlistClickHandler(cb) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, cb);
  }

  setMarkAsWatchedClickHandler(cb) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, cb);
  }

  setFavoriteClickHandler(cb) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, cb);
  }
}
