import PointsModel from './../model/points.js';
import {isOnline} from './../utils/common.js';
import {DataType} from './../const.js';


const createStoreStructure = (storeItems) => {
  return storeItems.reduce((accumulator, current) => {
    return Object.assign(
      {},
      accumulator,
      {
        [current.id]: current,
      },
    );
  }, {});
};


const getSyncedPoints = (items) => {
  return items.filter(({success}) => success).map(({payload}) => payload.point);
};


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }


  getData(dataType) {
    if (dataType === DataType.POINTS) {
      if (isOnline()) {
        return this._api.getData(dataType).then((points) => {
          const storeItems = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._store.setItems(storeItems);
          return points;
        });
      }
      const storePoints = Object.values(this._store.getItems());
      return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
    }
    if (isOnline()) {
      return this._api.getData(dataType).then((items) => {
        this._store.setItems(items);
        return items;
      });
    }
    const storeItems = this._store.getItems();
    return Promise.resolve(storeItems);
  }


  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point).then((updatedPoint) => {
        this._store.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
        return updatedPoint;
      });
    }
    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));
    return Promise.resolve(point);
  }


  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point).then((newPoint) => {
        this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
        return newPoint;
      });
    }
    return Promise.reject(new Error('Operation failed'));
  }


  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point).then(() => this._store.removeItem(point.id));
    }
    return Promise.reject(new Error('Operation failed'));
  }


  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());
      return this._api.sync(storePoints).then((response) => {
        const createdPoints = getSyncedPoints(response.created);
        const updatedPoints = getSyncedPoints(response.updated);
        const items = createStoreStructure([...createdPoints, ...updatedPoints]);
        this._store.setItems(items);
      });
    }
    return Promise.reject(new Error('Operation failed'));
  }
}
