import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getRating} from "../utils/common";

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
  const dateTo = new Date();
  let dateFrom;
  switch (rangeType) {
    case RangeType.ALL_TIME:
      return films;
    case RangeType.TODAY:
      dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 1);
      break;
    case RangeType.WEEK:
      dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 7);
      break;
    case RangeType.MONTH:
      dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - 1);
      break;
    case RangeType.YEAR:
      dateFrom = new Date();
      dateFrom.setFullYear(dateFrom.getFullYear() - 1);
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

const renderChart = (ctx, films) => {
  const BAR_HEIGHT = 50;
  const genres = getGenres(films);

  ctx.height = BAR_HEIGHT * genres.length;
  const genresNames = genres.map((it) => it.genre);
  const genresCount = genres.map((it) => it.count);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresNames,
      datasets: [{
        data: genresCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticTemplate = (films, rangeType) => {
  const alreadyWatchedFilms = getAlreadyWatchedFilms(films);
  const watchedInRangeFilms = getFilmsByDateRange(alreadyWatchedFilms, rangeType);
  const alreadyWatchedFilmsCount = watchedInRangeFilms.length;
  const [durationHours, durationMinutes] = alreadyWatchedFilmsCount === 0 ? [0, 0] : getTotalDuration(watchedInRangeFilms);
  const genres = getGenres(watchedInRangeFilms);
  const topGenre = alreadyWatchedFilmsCount === 0 ? `` : genres[0].genre;
  const rank = getRating(alreadyWatchedFilmsCount);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${rangeType === RangeType.ALL_TIME ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${rangeType === RangeType.TODAY ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${rangeType === RangeType.WEEK ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${rangeType === RangeType.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${rangeType === RangeType.YEAR ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${alreadyWatchedFilmsCount} <span class="statistic__item-description">movie${alreadyWatchedFilmsCount === 1 ? `` : `s`}</span></p>
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
  constructor({films}) {
    super();
    this._filmsModel = films;
    this._rangeType = RangeType.ALL_TIME;

    this._chart = null;

    this.setRangeChangeHandler();
  }

  recoveryListeners() {
    this.setRangeChangeHandler();
  }

  getTemplate() {
    return createStatisticTemplate(this._filmsModel.films, this._rangeType);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _renderChart() {
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    this._resetChart();
    const alreadyWatchedFilms = getAlreadyWatchedFilms(this._filmsModel.films);
    const watchedInRangeFilms = getFilmsByDateRange(alreadyWatchedFilms, this._rangeType);
    this._chart = renderChart(ctx, watchedInRangeFilms);
  }

  rerender(rangeType) {
    this._rangeType = rangeType;
    super.rerender();

    this._renderChart();
  }

  show() {
    super.show();
    this.rerender(this._rangeType);
  }

  setRangeChangeHandler() {
    const inputElements = this.getElement().querySelectorAll(`.statistic__filters-input`);
    inputElements.forEach((input) => input.addEventListener(`click`, (evt) => {
      const rangeType = evt.target.value;
      this.rerender(rangeType);
    }));
  }
}
