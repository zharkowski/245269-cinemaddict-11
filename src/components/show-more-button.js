import AbstractComponent from "./abstract-component";

const createShowMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more" tabindex="">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler(cb) {
    this.getElement().addEventListener(`click`, cb);
  }
}
