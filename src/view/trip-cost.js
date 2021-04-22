import AbstractView from './abstract.js';

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


export default class TripCost extends AbstractView {
  constructor(pointData) {
    super();
    this._pointData = pointData;
  }

  getTemplate() {
    return createTripCostTemplate(this._pointData);
  }
}
