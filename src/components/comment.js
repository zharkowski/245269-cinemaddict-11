import moment from "moment";
import AbstractSmartComponent from "./abstract-smart-component";
import {encode} from "he";

const DefaultData = {
  deleteButtonText: `Delete`,
};

const createCommentTemplate = (comment, externalData) => {
  const {comment: text, emotion, author, date} = comment;
  const encodedText = encode(text);
  const formattedDate = moment(date).fromNow();
  const deleteButtonText = externalData.deleteButtonText;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${encodedText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete">${deleteButtonText}</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment extends AbstractSmartComponent {
  constructor(comment) {
    super();
    this._comment = comment;
    this._externalData = DefaultData;

    this._deleteButtonClickHandler = null;
  }

  getTemplate() {
    return createCommentTemplate(this._comment, this._externalData);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  disableDeleteButton() {
    this.getElement().querySelector(`.film-details__comment-delete`).disabled = true;
  }

  enableDeleteButton() {
    this.getElement().querySelector(`.film-details__comment-delete`).disabled = false;
  }

  recoveryListeners() {
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }
}

