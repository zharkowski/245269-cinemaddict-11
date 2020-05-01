import AbstractComponent from "./abstract-component";

const createLoadTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`
  );
};

export default class Load extends AbstractComponent {
  getTemplate() {
    return createLoadTemplate();
  }
}
