import AbstractView from './abstract.js';
import {MenuItem} from './../const.js';


const createButtonNewTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
  type="button" data-menu-item="${MenuItem.NEW_EVENT}">New event</button>`;
};


export default class ButtonNew extends AbstractView {
  constructor() {
    super();
    this._onButtonNewClick = this._onButtonNewClick.bind(this);
  }


  getTemplate() {
    return createButtonNewTemplate();
  }


  setButtonNewListener(callback) {
    this._callback.buttonNewClick = callback;
    this.getElement().addEventListener('click', this._onButtonNewClick);
  }


  _onButtonNewClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    this._callback.buttonNewClick(evt.target.dataset.menuItem);
  }
}
