import {compareTwoDates} from './../utils/point.js';

const FIRST_INDEX = 1;

const ChartMode = {
  MONEY: 'money',
  TYPE: 'type',
  TIME: 'time',
};


export const getUniqueTypes = (points) => {
  const allTypes = points.map((point) => point.type);
  const uniqueTypes = Array.from(new Set(allTypes));
  return uniqueTypes;
};


export const sortByDecreasing = (elementA, elementB) => elementB[FIRST_INDEX] - elementA[FIRST_INDEX];


export const getSortedData = (points, uniqueTypes, chartMode) => {
  const data = {};

  uniqueTypes.forEach((type) => data[type] = 0);
  switch(chartMode) {
    case ChartMode.MONEY:
      points.forEach((point) => data[point.type] += point.basePrice);
      break;
    case ChartMode.TYPE:
      points.forEach((point) => data[point.type] ++);
      break;
    case ChartMode.TIME:
      points.forEach((point) => data[point.type] += compareTwoDates(point.dateTo, point.dateFrom));
      break;
    default:
      throw new Error('Unknown chart-mode. Check ChartMode value');
  }
  const sortedData = Object.entries(data).slice().sort(sortByDecreasing);

  const transferToObject = (previousValue, [type, value]) => {
    return Object.assign(
      previousValue,
      previousValue.types.push(type.toUpperCase()),
      previousValue.values.push(value),
    );
  };
  return sortedData.reduce(transferToObject, {types: [], values: []});
};
