import CommentComponent from "../components/comment";
import {RenderPosition, render, remove, replace} from "../utils/render";
import assignment from "assignment";

export const EmptyComment = {
  "comment": ``,
  "date": ``,
  "emotion": ``,
};

export default class CommentsController {
  constructor(container, commentsModel, commentDataChangeHandler) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._commentDataChangeHandler = commentDataChangeHandler;

    this._commentComponent = null;
  }

  removeComment(id) {
    this._commentsModel.removeComment(id);
    remove(this._commentComponent);
  }

  destroy() {
    remove(this._commentComponent);
  }

  // const newCommentKeydownHandler = (evt) => {
  //   if (evt.key === KEY.ENTER
  //     || (evt.key === KEY.LEFT_COMMAND || evt.key === KEY.RIGHT_COMMAND
  //       || evt.key === KEY.LEFT_CTRL || evt.key === KEY.RIGHT_CTRL)) {
  //     console.log(`qerty`);
  //   }
  // };

  addComment(localComment) {
    const commentId = String(new Date() + Math.random());
    this._commentDataChangeHandler(this, null, assignment({}, localComment, {id: commentId, author: ``}));
  }

  render(comment) {
    const oldCommentComponent = this._commentComponent;

    this._commentComponent = new CommentComponent(comment);
    const commentComponent = this._commentComponent;

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
}
