import MainMenuView from './view/main-menu.js';
import FilterView from './view/filter.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import TripSortView from './view/trip-sort.js';
import PointListView from './view/point-list.js';
import PointEditorView from './view/point-editor.js';
import PointView from './view/point.js';
import ListEmptyView from './view/list-empty.js';

import {generatePointData} from './mock/point-data-generator.js';
import {generateFilterData} from './mock/filter-data-generator.js';
import {render, RenderPosition, isEscEvent} from './utils.js';


const POINT_COUNT = 20;

const siteBodyElement = document.querySelector('.page-body');
const menuElement = siteBodyElement.querySelector('.trip-controls__navigation');
const filterElement = siteBodyElement.querySelector('.trip-controls__filters');
const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
const tripBoardElement = siteBodyElement.querySelector('.trip-events');


const randomPointsData = new Array(POINT_COUNT).fill(null).map(generatePointData);
const filterData = generateFilterData(randomPointsData);


render(menuElement, new MainMenuView().getElement());
render(filterElement, new FilterView(filterData).getElement());


const renderPoint = (pointListElement, pointData) => {
  const pointComponent = new PointView(pointData);
  const pointEditorComponent = new PointEditorView(pointData);

  const onEditorPointEscKeyDown = (evt) => {
    if (isEscEvent) {
      evt.preventDefault();
      changeViewToPoint();
    }
  };

  const changeViewToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditorComponent.getElement());
    document.removeEventListener('keydown', onEditorPointEscKeyDown);

  };

  const changeViewToEdit = () => {
    pointListElement.replaceChild(pointEditorComponent.getElement(), pointComponent.getElement());
    document.addEventListener('keydown', onEditorPointEscKeyDown);

  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', changeViewToEdit);
  pointEditorComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', changeViewToPoint);
  pointEditorComponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    changeViewToPoint();
  });

  render(pointListElement, pointComponent.getElement());
};


const renderBoard = (pointData) => {
  if (pointData.length === 0) {
    render(tripBoardElement, new ListEmptyView().getElement());
    return;
  }

  const tripInfoComponent = new TripInfoView(randomPointsData);
  render(tripDetailsElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
  render(tripInfoComponent.getElement(), new TripCostView(randomPointsData).getElement());
  render(tripBoardElement, new TripSortView().getElement());
  const pointListComponent = new PointListView();
  render(tripBoardElement, pointListComponent.getElement());

  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(pointListComponent.getElement(), pointData[i]);
  }
};

renderBoard(randomPointsData);
