import AbstractView from './abstract.js';

const createFilterItemTemplate = (filterData, currentFilterType) => {
  return filterData.map(({type, name, amount}) => {
    return `<div class="trip-filters__filter">
     <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${amount === 0 ? 'disabled' : ''}>
     <label class="trip-filters__filter-label" for="filter-${name}">${name} ${amount === 0 ? '' : amount}</label>
    </div>`;
  }).join('');
};


const createFilterTemplate = (filterData, currentFilterType) => {
  return `<form class="trip-filters" action="#" method="get">
    ${createFilterItemTemplate(filterData, currentFilterType)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};


export default class Filter extends AbstractView {
  constructor(filterData, currentFilterType) {
    super();
    this._filterData = filterData;
    this._currentFilterType = currentFilterType;

    this._onFilterViewAction = this._onFilterViewAction.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filterData, this._currentFilterType);
  }

  setFilterChangeListener(callback) {
    this._callback.filterChange = callback;
    this.getElement().addEventListener('change', this._onFilterViewAction);
  }


  _onFilterViewAction(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.filterChange(evt.target.value);
  }
}
