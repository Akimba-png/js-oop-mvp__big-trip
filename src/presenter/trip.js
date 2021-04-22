import TripInfoView from './../view/trip-info.js';
import TripCostView from './../view/trip-cost.js';
import PointListView from './../view/point-list.js';
import TripSortView from './../view/trip-sort.js';
import ListEmptyView from './../view/list-empty.js';
import PointView from './../view/point.js';
import PointEditorView from './../view/point-editor.js';
import {render, replace, RenderPosition} from './../utils/render.js';
import {isEscEvent} from './../utils/common.js';


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
    const pointComponent = new PointView(point);
    const pointEditorComponent = new PointEditorView(point);

    const onEditorPointEscKeyDown = (evt) => {
      if (isEscEvent) {
        evt.preventDefault();
        changeViewToPoint();
      }
    };

    const changeViewToPoint = () => {
      replace(pointComponent, pointEditorComponent);
      document.removeEventListener('keydown', onEditorPointEscKeyDown);

    };

    const changeViewToEdit = () => {
      replace(pointEditorComponent, pointComponent);
      document.addEventListener('keydown', onEditorPointEscKeyDown);

    };

    pointComponent.setClickListener(changeViewToEdit);
    pointEditorComponent.setClickListener(changeViewToPoint);
    pointEditorComponent.setSubmitListener(changeViewToPoint);

    render(this._pointListComponent, pointComponent);

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
