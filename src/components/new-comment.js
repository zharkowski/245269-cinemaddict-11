import AbstractSmartComponent from "./abstract-smart-component";
import {EMOTIONS, KEY} from "../consts";

const createEmotionsTemplate = (activeEmoji) => {
  return EMOTIONS.map((emotion) => {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${emotion === activeEmoji ? `checked=""` : ``}>
        <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
        </label>`
    );
  }).join(`\n`);
};

const createNewCommentTemplate = (activeEmoji) => {
  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">
        ${activeEmoji ? `<img src="images/emoji/${activeEmoji}.png" alt="emoji-${activeEmoji}" width="55" height="55">` : ``}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        ${createEmotionsTemplate(activeEmoji)}
      </div>
    </div>`
  );
};

export default class NewComment extends AbstractSmartComponent {
  constructor() {
    super();
    this._activeEmoji = null;
    this._sendCommentKeydownHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createNewCommentTemplate(this._activeEmoji);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSendCommentKeydownHandler(this._sendCommentKeydownHandler);
  }

  _subscribeOnEvents() {
    const emojiButtons = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    emojiButtons.forEach((button) => {
      button.addEventListener(`click`, () => {
        this._activeEmoji = button.value;
        this.rerender();
      });
    });
  }

  setSendCommentKeydownHandler(handler) {
    const keydownHandler = (evt) => {
      if (evt.key === KEY.ENTER
        || (evt.key === KEY.LEFT_COMMAND || evt.key === KEY.RIGHT_COMMAND
          || evt.key === KEY.LEFT_CTRL || evt.key === KEY.RIGHT_CTRL)) {
        handler();
      }
    };
    document.addEventListener(`keydown`, keydownHandler);
    this._sendCommentKeydownHandler = handler;
  }
}
