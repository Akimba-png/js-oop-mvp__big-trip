import AbstractView from './abstract.js';
import {MenuItem, Tag} from './../const.js';

const DISABLED_STATUS = 'disabled';


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


  toggleDisablesStatus() {
    const button = this.getElement();
    if (button.hasAttribute(DISABLED_STATUS)) {
      button.removeAttribute(DISABLED_STATUS);
      return;
    }
    button.setAttribute(DISABLED_STATUS, DISABLED_STATUS);
  }


  _onButtonNewClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== Tag.BUTTON) {
      return;
    }
    this._callback.buttonNewClick(evt.target.dataset.menuItem);
  }
}
