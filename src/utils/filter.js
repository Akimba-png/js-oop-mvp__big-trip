import {isDateExpired, isDateInFuture,  isDateCurrent, isEventContinues} from '../utils/point.js';
import {FilterType} from './../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateInFuture(point.dateFrom) ||
  isDateCurrent(point.dateTo) || isEventContinues(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isDateExpired(point.dateTo) ||
  isEventContinues(point.dateFrom, point.dateTo)),
};

