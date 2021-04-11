import {isDateExpired, isDateInFuture,  isDateCurrent, isEventContinues} from '../utils.js';


const pointToFilterMap = {
  everything: (points) => points.length,
  future: (points) =>
    points.filter((point) => isDateInFuture(point.dateFrom)).length +
    points.filter((point) => isDateCurrent(point.dateTo)).length +
    points.filter((point) => isEventContinues(point.dateFrom, point.dateTo)).length,
  past: (points) =>
    points.filter((point) => isDateExpired(point.dateTo)).length +
    points.filter((point) => isEventContinues(point.dateFrom, point.dateTo)).length,
};


export const generateFilterData = (points) => {
  return Object.entries(pointToFilterMap).map(([filterName, pointAmount]) => {
    return {
      name: filterName,
      amount: pointAmount(points),
    };
  });
};
