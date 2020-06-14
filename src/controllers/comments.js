// components
import CommentComponent from "../components/comment";
// utils
import {RenderPosition, render, remove, replace} from "../utils/render";

export default class CommentsController {
  constructor(container, commentsModel, commentDataChangeHandler) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._commentDataChangeHandler = commentDataChangeHandler;

    this._IdToCommentComponent = {};
  }

  _renderComment(comment) {
    const oldCommentComponent = this._IdToCommentComponent[comment.id];

    const commentComponent = new CommentComponent(comment);
    this._IdToCommentComponent[comment.id] = commentComponent;

    const deleteClickHandler = (evt) => {
      evt.preventDefault();
      this._commentDataChangeHandler(this, comment, null);
    };
    commentComponent.setDeleteButtonClickHandler(deleteClickHandler);

    if (oldCommentComponent) {
      replace(commentComponent, oldCommentComponent);
    } else {
      render(this._container, commentComponent, RenderPosition.BEFOREEND);
    }
  }

  removeComment(id) {
    this._commentsModel.removeComment(id);
    const commentComponent = this._IdToCommentComponent[id];
    remove(commentComponent);
  }

  destroy(comment) {
    if (this._IdToCommentComponent[comment.id]) {
      remove(this._IdToCommentComponent[comment.id]);
    }
  }

  render(comments) {
    comments.forEach((comment) => this._renderComment(comment));
  }
}
