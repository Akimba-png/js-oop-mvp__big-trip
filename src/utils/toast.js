const SHOW_TIME = 5000;

const toastContainerElement = document.createElement('div');
toastContainerElement.classList.add('toast-container');
document.body.append(toastContainerElement);

export const toast = () => {
  const toastItemElement = document.createElement('div');
  toastItemElement.textContent = 'can\'t do it in offline';
  toastItemElement.classList.add('toast-container__item');
  toastContainerElement.append(toastItemElement);
  setTimeout(() => {
    toastItemElement.remove();
  }, SHOW_TIME);
};

export const toastPermanent = () => {
  const toastItemElement = document.createElement('div');
  toastItemElement.textContent = 'we are offline';
  toastItemElement.classList.add('toast-container__item', 'toast-container__item--permanent');
  toastContainerElement.append(toastItemElement);
};

export const toastRemove = () => {
  const toastItemElement = toastContainerElement.querySelector('.toast-container__item--permanent');
  if (toastItemElement) {
    toastItemElement.remove();
  }
};
