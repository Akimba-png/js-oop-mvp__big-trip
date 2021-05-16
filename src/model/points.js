import Observer from './../utils/observer.js';
import {Index} from './../const.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    console.log(this._points);
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
    if (index === -1) {
      throw new Error('Can\'t update unexisted point');
    }
    this._points.splice(index, 1);
    this._notify(updateType);
  }
}
