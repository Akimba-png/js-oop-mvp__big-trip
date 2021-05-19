import AbstractView from './abstract.js';

const createErrorTemplate = () => {
  return '<p class="trip-events__msg trip-events__msg--error">Error while loading... Try again later</p>';
};


export default class Error extends AbstractView {
  getTemplate() {
    return createErrorTemplate();
  }
}
