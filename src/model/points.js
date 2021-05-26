import Observer from './../utils/observer.js';
import {FlagMode, Index} from './../const.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }


  updatePoint(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === Index.PREVIOUS) {
      throw new Error('Can\'t update unexisted point');
    }

    this._points = [
      ...this._points.slice(0, index), updatedPoint, ...this._points.slice(index + Index.NEXT),
    ];

    this._notify(updateType, updatedPoint);
  }


  addPoint(updateType, updatedPoint) {
    this._points = [
      updatedPoint, ...this._points,
    ];

    this._notify(updateType, updatedPoint);
  }


  deletePoint(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);
    if (index === Index.PREVIOUS) {
      throw new Error('Can\'t update unexisted point');
    }
    this._points.splice(index, Index.NEXT);
    this._notify(updateType);
  }


  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        basePrice: point.base_price,
        dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        isFavorite: point.is_favorite,
      },
    );
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    return adaptedPoint;
  }


  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.basePrice,
        'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
        'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
        'is_favorite': point.isFavorite !== undefined ? point.isFavorite : FlagMode.FALSE,
      },
    );
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    return adaptedPoint;
  }
}
