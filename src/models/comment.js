export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.comment = data[`comment`] || ``;
    this.date = data[`date`] ? new Date(data[`date`]) : null;
    this.emotion = data[`emotion`] ? data[`emotion`] : null;
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  toRAW() {
    return {
      "id": this.id,
      "author": this.author,
      "comment": this.comment ? this.comment : ``,
      "date": this.date ? this.date.toISOString() : null,
      "emotion": this.date ? this.date.toISOString() : null,
    };
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
