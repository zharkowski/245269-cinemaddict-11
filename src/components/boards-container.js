import AbstractComponent from "./abstract-component";

const createBoardTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class BoardsContainer extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
