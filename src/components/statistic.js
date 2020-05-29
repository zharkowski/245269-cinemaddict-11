import AbstractSmartComponent from "./abstract-smart-component";
// import Chart from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

const RangeType = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const getAlreadyWatchedFilms = (films) => {
  return films.filter((film) => film.userDetails.alreadyWatched);
};

const getFilmsByDateRange = (films, rangeType) => {
  const dateTo = moment();
  let dateFrom;
  switch (rangeType) {
    case RangeType.ALL_TIME:
      return films;
    case RangeType.TODAY:
      dateFrom = moment().subtract(1, `days`);
      break;
    case RangeType.WEEK:
      dateFrom = moment().subtract(7, `days`);
      break;
    case RangeType.MONTH:
      dateFrom = moment().subtract(1, `months`);
      break;
    case RangeType.YEAR:
      dateFrom = moment().subtract(1, `years`);
      break;
  }
  return films.filter((film) => {
    const watchingDate = film.userDetails.watchingDate;
    return watchingDate >= dateFrom && watchingDate <= dateTo;
  });
};

const getTotalDuration = (films) => {
  let totalDuration = 0;
  films.forEach((film) => {
    totalDuration += film.filmInfo.runtime;
  });

  return [Math.floor(totalDuration / 60), totalDuration % 60];
};

const getGenres = (films) => {
  const result = [];
  films.forEach((film) => {
    const genres = film.filmInfo.genre;
    genres.forEach((it) => {
      const genreObject = result.find((item) => item.genre === it);
      if (genreObject) {
        genreObject.count++;
      } else {
        result.push({genre: it, count: 1});
      }
    });
  });

  result.sort((a, b) => b.count - a.count);
  return result;
};

const createStatisticTemplate = (films, rangeType) => {
  const alreadyWatchedFilms = getAlreadyWatchedFilms(films);
  const watchedInRangeFilms = getFilmsByDateRange(alreadyWatchedFilms, rangeType);
  const alreadyWatchedFilmsCount = watchedInRangeFilms.length;
  const [durationHours, durationMinutes] = getTotalDuration(watchedInRangeFilms);
  const genres = getGenres(watchedInRangeFilms);
  const topGenre = genres[0].genre;

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${alreadyWatchedFilmsCount} <span class="statistic__item-description">movie${alreadyWatchedFilmsCount === 1 ? `:` : `s`}</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistic extends AbstractSmartComponent {
  constructor(films) {
    super();
    this._films = films;
    this._rangeType = RangeType.ALL_TIME;
  }
  recoveryListeners() {}

  getTemplate() {
    return createStatisticTemplate(this._films, this._rangeType);
  }

  _renderChart() {
    //
  }

  rerender(films, rangeType) {
    this._films = films;
    this._rangeType = rangeType;

    super.rerender();

    this._renderChart();
  }
}
