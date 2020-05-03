export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

export const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};

export const remove = (component) => {
  component.getElement().remove();
};
