import CommentComponent from "../components/comment";
import {RenderPosition, render, remove, replace} from "../utils/render";

export default class CommentsController {
  constructor(container, commentsModel, commentDataChangeHandler) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._commentDataChangeHandler = commentDataChangeHandler;

    this._commentComponent = null;
  }

  remove(id) {
    this._commentsModel.removeComment(id);
    remove(this._commentComponent);
  }

  destroy() {
    remove(this._commentComponent);
  }

  render(comment) {
    const oldCommentComponent = this._commentComponent;

    this._commentComponent = new CommentComponent(comment);
    const commentComponent = this._commentComponent;

    const deleteClickHandler = (evt) => {
      evt.preventDefault();
      this._commentDataChangeHandler(this, this._commentsModel, comment, null);
    };

    commentComponent.setDeleteButtonClickHandler(deleteClickHandler);

    if (oldCommentComponent) {
      replace(commentComponent, oldCommentComponent);
    } else {
      render(this._container, commentComponent, RenderPosition.BEFOREEND);
    }
  }
}
