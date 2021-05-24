const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

export const toast = () => {
  const toastItem = document.createElement('div');
  toastItem.textContent = 'can\`t do it in offline';
  toastItem.classList.add('toast-item');
  toastContainer.append(toastItem);
  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};
