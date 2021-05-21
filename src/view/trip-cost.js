import AbstractView from './abstract.js';

const getTotalCost = (pointData) => {
  let totalCost = 0;
  pointData.forEach(({basePrice, offers}) => {
    let offersCost = 0;
    offers.forEach((offer) => offersCost += offer.price);
    totalCost += basePrice + offersCost;
  });
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
