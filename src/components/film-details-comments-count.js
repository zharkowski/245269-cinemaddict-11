import AbstractComponent from "./abstract-component";

const createCommentsCountTemplate = (commentsCount) => {
  return (
    `<h3 class="film-details__comments-title">Comment${commentsCount !== 1 ? `s` : ``}
      <span class="film-details__comments-count">${commentsCount}</span>
    </h3>`
  );
};

export default class FilmDetailsCommentsCount extends AbstractComponent {
  constructor(commentsCount) {
    super();
    this._commentsCount = commentsCount;
  }

  getTemplate() {
    return createCommentsCountTemplate(this._commentsCount);
  }
}
