import AbstractComponent from "./abstract-component";

const createFilmCommentsCountTemplate = (commentsCount) => {
  return (
    `<a class="film-card__comments">${commentsCount} comment${commentsCount !== 1 ? `s` : ``}</a>`
  );
};

export default class FilmCommentsCount extends AbstractComponent {
  constructor(commentsModel) {
    super();
    this._commentsModel = commentsModel;
  }

  getTemplate() {
    return createFilmCommentsCountTemplate(this._commentsModel.comments.length);
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
