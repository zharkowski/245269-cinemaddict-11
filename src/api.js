import Film from "./models/film";
import Comment from "./models/comment";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getFilms() {
    return this._load({
      url: `movies`
    })
      .then((response) => response.json())
      .then(Film.parseFilms)
      .catch(() => []);
  }

  getComment(filmId) {
    return this._load({
      url: `comments/${filmId}`
    })
      .then((response) => response.json())
      .then(Comment.parseComments)
      .catch(() => []);
  }
}
