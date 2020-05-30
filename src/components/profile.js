import AbstractComponent from "./abstract-component";
import {getRating} from "../utils/common";

const createProfileTemplate = (filmsCount) => {
  const rating = getRating(filmsCount);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }
  getTemplate() {
    return createProfileTemplate(this._filmsCount);
  }
}
