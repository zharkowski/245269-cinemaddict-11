export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`] || [];
    this.filmInfo = {
      title: data[`film_info`][`title`],
      alternativeTitle: data[`film_info`][`alternative_title`] || ``,
      totalRating: data[`film_info`][`total_rating`],
      poster: data[`film_info`][`poster`],
      ageRating: data[`film_info`][`age_rating`],
      director: data[`film_info`][`director`],
      writers: data[`film_info`][`writers`],
      actors: data[`film_info`][`actors`],
      release: {
        date: data[`film_info`][`release`][`date`] ? new Date(data[`film_info`][`release`][`date`]) : null,
        releaseCountry: data[`film_info`][`release`][`release_country`]
      },
      runtime: data[`film_info`][`runtime`],
      genre: data[`film_info`][`genre`],
      description: data[`film_info`][`description`] || ``,
    };
    this.userDetails = {
      watchlist: Boolean(data[`user_details`][`watchlist`]),
      alreadyWatched: Boolean(data[`user_details`][`already_watched`]),
      watchingDate: data[`user_details`][`watching_date`] ? new Date(data[`user_details`][`watching_date`]) : null,
      favorite: Boolean(data[`user_details`][`favorite`]),
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.filmInfo.title,
        "alternative_title": this.filmInfo.alternativeTitle,
        "total_rating": this.filmInfo.totalRating,
        "poster": this.filmInfo.poster,
        "age_rating": this.filmInfo.ageRating,
        "director": this.filmInfo.director,
        "writers": this.filmInfo.writers,
        "actors": this.filmInfo.actors,
        "release": {
          "date": this.filmInfo.release.date ? this.filmInfo.release.date.toISOString() : null,
          "release_country": this.filmInfo.release.releaseCountry,
        },
        "runtime": this.filmInfo.runtime,
        "genre": this.filmInfo.genre,
        "description": this.filmInfo.description,
      },
      "user_details": {
        "watchlist": this.userDetails.watchlist,
        "already_watched": this.userDetails.alreadyWatched,
        "watching_date": this.userDetails.watchingDate ? this.userDetails.watchingDate.toISOString() : null,
        "favorite": this.userDetails.favorite,
      }
    };
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
