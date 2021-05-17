import PointsModel from './model/points.js';
import {DataType} from './const.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

const SuccessStatusRange = {
  MIN: 200,
  MAX: 299,
};


export default class Api {
  constructor(endPoint, authorizationKey) {
    this._endPoint = endPoint;
    this._authorizationKey = authorizationKey;
  }


  getData(dataType) {
    if (dataType === DataType.POINTS) {
      return this._load({url: dataType})
        .then(Api.toJSON)
        .then((points) => points.map(PointsModel.adaptToClient));
    }
    return this._load({url: dataType})
      .then(Api.toJSON);
  }


  updatePoint(point) {
    this._load({
      url: `${DataType.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }


  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorizationKey);
    return fetch(
      `${this._endPoint}/${url}`,
      {method, headers, body},
    ).then(Api.checkStatus)
      .catch(Api.catchError);
  }


  static checkStatus(response) {
    if (response.status < SuccessStatusRange.MIN ||
      response.status > SuccessStatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }


  static catchError(error) {
    throw error;
  }


  static toJSON(response) {
    return response.json();
  }
}
