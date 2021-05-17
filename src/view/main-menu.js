import AbstractView from './abstract.js';
import {MenuItem, Tag} from './../const.js';


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
    this._previousClickValue = MenuItem.TABLE;
  }


  getTemplate() {
    return createMainMenuTemplate();
  }


  setMenuListener(callback) {
    this._callback.menuItemClick = callback;
    this.getElement().addEventListener('click', this._onMenuItemClick);
  }


  _onMenuItemClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== Tag.A) {
      return;
    }
    if (evt.target.dataset.menuItem === this._previousClickValue) {
      return;
    }
    this._callback.menuItemClick(evt.target.dataset.menuItem);
    this._previousClickValue = evt.target.dataset.menuItem;
    this._changeActiveItem();
  }


  _changeActiveItem() {
    const tableItem = this.getElement().querySelector(`[data-menu-item=${MenuItem.TABLE}]`);
    const statsItem = this.getElement().querySelector(`[data-menu-item=${MenuItem.STATS}]`);
    if (tableItem !== null && statsItem !== null) {
      tableItem.classList.toggle('trip-tabs__btn--active');
      statsItem.classList.toggle('trip-tabs__btn--active');
    }
  }
}
