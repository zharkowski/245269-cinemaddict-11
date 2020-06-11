import {getAlreadyWatchedFilmsCount, getRating} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";

const createProfileTemplate = (filmsCount) => {
  const rating = getRating(filmsCount);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
  }

  getTemplate() {
    return createProfileTemplate(getAlreadyWatchedFilmsCount(this._filmsModel.films));
  }

  recoveryListeners() {}
}
