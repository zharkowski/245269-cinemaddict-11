import moment from "moment";
import AbstractComponent from "./abstract-component";

const createCommentTemplate = (comment) => {
  const {comment: text, emotion, author, date} = comment;
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

export default class Comment extends AbstractComponent {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);
  }
}

