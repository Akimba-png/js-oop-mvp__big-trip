import Abstract from './../view/abstract.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};


export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};


export const render = (container, element, position = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    default:
      throw new Error(`Unknown render position: '${position}'`);
  }
};


export const replace = (newElement, currentElement) => {
  if (currentElement instanceof Abstract) {
    currentElement = currentElement.getElement();
  }

  if (newElement instanceof Abstract) {
    newElement = newElement.getElement();
  }

  const parentElement = currentElement.parentElement;

  if (parentElement === null || currentElement === null || newElement === null) {
    throw new Error('one of the replaced elements does not exist ');
  }

  parentElement.replaceChild(newElement, currentElement);
};


export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
  component.removeElement();
};
