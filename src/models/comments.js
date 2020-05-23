export default class Comments {
  constructor() {
    this._comments = null;

    this._dataChangeHandlers = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  get comments() {
    return this._comments;
  }

  set comments(comments) {
    this._comments = comments;
  }

  setDateChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  updateComment(id, updatedComment) {
    const index = this.comments.findIndex((comment) => comment.id === id);
    if (index === -1) {
      return false;
    }

    this.comments = [].concat(this.comments.slice(0, index), updatedComment, this.comments.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }
}
