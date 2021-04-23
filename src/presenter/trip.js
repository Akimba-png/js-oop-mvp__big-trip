import PointPresenter from './point.js';
import TripInfoView from './../view/trip-info.js';
import TripCostView from './../view/trip-cost.js';
import PointListView from './../view/point-list.js';
import TripSortView from './../view/trip-sort.js';
import ListEmptyView from './../view/list-empty.js';
import {render, RenderPosition} from './../utils/render.js';


export default class Trip {
  constructor(tripContainer, tripDetailsContainer) {
    this._tripContainer = tripContainer;
    this._tripDetailsContainer = tripDetailsContainer;

    this._tripSortComponent = new TripSortView();
    this._pointListComponent = new PointListView();
    this._listEmptyComponent = new ListEmptyView();
  }


  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    render(this._tripContainer, this._pointListComponent);
    this._renderBoard();
  }


  _renderTripSort() {
    render(this._tripContainer, this._tripSortComponent);
  }


  _renderListEmpty() {
    render(this._tripContainer, this._listEmptyComponent);
  }


  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent);
    pointPresenter.init(point);
  }


  _renderPoints() {
    this._tripPoints.slice().forEach((tripPoint) => this._renderPoint(tripPoint));
  }


  _renderTripInfo() {
    const tripInfoComponent = new TripInfoView(this._tripPoints);
    render(this._tripDetailsContainer, tripInfoComponent, RenderPosition.AFTERBEGIN);
    const tripCostComponent = new TripCostView(this._tripPoints);
    render(tripInfoComponent, tripCostComponent);
  }


  _renderBoard() {
    if (this._tripPoints.length === 0) {
      this._renderListEmpty();
      return;
    }
    this._renderTripSort();
    this._renderPoints();
    this._renderTripInfo();
  }
}
