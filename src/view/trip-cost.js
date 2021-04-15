import {createElement} from './../utils.js';

const getTotalCost = (pointData) => {
  let totalCost = 0;
  pointData.forEach(({basePrice}) => totalCost += basePrice);
  return totalCost;
};


const createTripCostTemplate = (pointData) => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalCost(pointData)}</span>
  </p>`;
};


export default class TripCost {
  constructor(pointData) {
    this._pointData = pointData;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._pointData);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
