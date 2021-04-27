import PointPresenter from './point.js';
import TripInfoView from './../view/trip-info.js';
import TripCostView from './../view/trip-cost.js';
import PointListView from './../view/point-list.js';
import TripSortView from './../view/trip-sort.js';
import ListEmptyView from './../view/list-empty.js';
import {render, RenderPosition} from './../utils/render.js';
import {updatePoint} from './../utils/common.js';
import {SortType} from './../const.js';
import {sortByPrice, sortByTime} from './../utils/point.js';


export default class Trip {
  constructor(tripContainer, tripDetailsContainer) {
    this._tripContainer = tripContainer;
    this._tripDetailsContainer = tripDetailsContainer;

    this._tripSortComponent = new TripSortView();
    this._pointListComponent = new PointListView();
    this._listEmptyComponent = new ListEmptyView();

    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._onPointChange = this._onPointChange.bind(this);
    this._onPointModeChange = this._onPointModeChange.bind(this);
    this._onChangeSort = this._onChangeSort.bind(this);
  }


  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._initialTripPoints = tripPoints.slice();
    render(this._tripContainer, this._pointListComponent);
    this._renderBoard();
  }


  _renderTripSort() {
    render(this._tripContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeListener(this._onChangeSort);
  }


  _changeSorting(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._tripPoints = this._initialTripPoints.slice();
        break;
      case SortType.TIME:
        this._tripPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._tripPoints.sort(sortByPrice);
        break;
      default:
        throw new Error('Unknown sort-type. Need to add data attribute to certain input first.');
    }
    this._currentSortType = sortType;
  }


  _onChangeSort(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._changeSorting(sortType);
    this._clearAllPoints();
    this._renderPoints();
  }


  _renderListEmpty() {
    render(this._tripContainer, this._listEmptyComponent);
  }


  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._onPointChange, this._onPointModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }


  _onPointChange(modifiedPoint) {
    this._tripPoints = updatePoint(this._tripPoints, modifiedPoint);
    this._initialTripPoints = updatePoint(this._initialTripPoints, modifiedPoint);
    this._pointPresenter[modifiedPoint.id].init(modifiedPoint);
  }


  _renderPoints() {
    this._tripPoints.slice().forEach((tripPoint) => this._renderPoint(tripPoint));
  }


  _clearAllPoints() {
    Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.destroy());
    this._pointPresenter = {};
  }


  _onPointModeChange() {
    Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.resetView());
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
