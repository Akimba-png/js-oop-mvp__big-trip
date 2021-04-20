import AbstractView from './abstract.js';
import {compareTwoDates, humanizeDate} from './../utils.js';
import {DateFormat} from './../const.js';

const getTotalRoute = (pointData) => {
  const uniqueCityList = new Set(pointData.map(({destination}) => destination.name));
  const totalRoute = Array.from(uniqueCityList).join(' &mdash; ');
  return totalRoute;
};


const getTotalDateGap = (pointData) => {
  const datesFrom = pointData.map(({dateFrom}) => dateFrom).sort(compareTwoDates).shift();
  const datesTo = pointData.map(({dateTo}) => dateTo).sort(compareTwoDates).pop();
  return `${humanizeDate(datesFrom, DateFormat.DAY_MONTH)} - ${humanizeDate(datesTo, DateFormat.DAY_MONTH)}`;
};


const createTripInfoTemplate = (pointData) => {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTotalRoute(pointData)}</h1>
      <p class="trip-info__dates">${getTotalDateGap(pointData)}</p>
    </div>
  </section>`;
};


export default class TripInfo extends AbstractView {
  constructor(pointData) {
    super();
    this._pointData = pointData;
  }

  getTemplate() {
    return createTripInfoTemplate(this._pointData);
  }
}
