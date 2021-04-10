import {compareTwoDates, humanizeDate} from './../utils.js';
import {DateFormat} from './../const.js';


const getTotalRoute = (randomPointsData) => {
  const uniqueCityList = new Set(randomPointsData.map(({destination}) => destination.name));
  const totalRoute = Array.from(uniqueCityList).join(' &mdash; ');
  return totalRoute;
};


const getTotalDateGap = (randomPointsData) => {
  const datesFrom = randomPointsData.map(({dateFrom}) => dateFrom).sort(compareTwoDates).shift();
  const datesTo = randomPointsData.map(({dateTo}) => dateTo).sort(compareTwoDates).pop();
  return `${humanizeDate(datesFrom, DateFormat.DAY_MONTH)} - ${humanizeDate(datesTo, DateFormat.DAY_MONTH)}`;
};


export const createTripInfoTemplate = (randomPointsData) => {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTotalRoute(randomPointsData)}</h1>
      <p class="trip-info__dates">${getTotalDateGap(randomPointsData)}</p>
    </div>
  </section>`;
};
