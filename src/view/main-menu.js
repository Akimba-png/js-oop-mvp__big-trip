import AbstractView from './abstract.js';
import {MenuItem} from './../const.js';


const createMainMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
  </nav>`;
};


export default class MainMenu extends AbstractView {
  constructor() {
    super();
    this._onMenuItemClick = this._onMenuItemClick.bind(this);
    this._previousClickValue = null;
  }


  getTemplate() {
    return createMainMenuTemplate();
  }


  setMenuListener(callback) {
    this._callback.menuItemClick = callback;
    this.getElement().addEventListener('click', this._onMenuItemClick);
  }


  _onMenuItemClick(evt) {
    if (evt.target.dataset.menuItem === this._previousClickValue) {
      return;
    }
    evt.preventDefault();
    // В КОНСТАНТУ
    if (evt.target.tagName !== 'A') {
      return;
    }
    this._callback.menuItemClick(evt.target.dataset.menuItem);
    this._previousClickValue = evt.target.dataset.menuItem;
  }


  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);
    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }
}
