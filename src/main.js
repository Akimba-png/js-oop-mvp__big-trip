import MainMenuView from './view/main-menu.js';
import FilterView from './view/filter.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import TripSortView from './view/trip-sort.js';
import PointListView from './view/point-list.js';
import PointEditorView from './view/point-editor.js';
import PointView from './view/point.js';

import {generatePointData} from './mock/point-data-generator.js';
import {generateFilterData} from './mock/filter-data-generator.js';
import {render, RenderPosition} from './utils.js';


const POINT_COUNT = 20;

const randomPointsData = new Array(POINT_COUNT).fill(null).map(generatePointData);
const filterData = generateFilterData(randomPointsData);


const siteBodyElement = document.querySelector('.page-body');

const menuElement = siteBodyElement.querySelector('.trip-controls__navigation');
render(menuElement, new MainMenuView().getElement());

const filterElement = siteBodyElement.querySelector('.trip-controls__filters');
render(filterElement, new FilterView(filterData).getElement());

const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
render(tripDetailsElement, new TripInfoView(randomPointsData).getElement(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripDetailsElement.querySelector('.trip-info');
render(tripInfoElement, new TripCostView(randomPointsData).getElement());

const tripBoardElement = siteBodyElement.querySelector('.trip-events');
render(tripBoardElement, new TripSortView().getElement());
const pointListComponent = new PointListView();
render(tripBoardElement, pointListComponent.getElement());


const renderPoint = (pointListElement, pointData) => {
  const pointComponent = new PointView(pointData);
  const pointEditorComponent = new PointEditorView(pointData);

  const changeViewToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditorComponent.getElement());
  };
  const changeViewToEdit = () => {
    pointListElement.replaceChild(pointEditorComponent.getElement(), pointComponent.getElement());
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', changeViewToEdit);
  pointEditorComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', changeViewToPoint);
  pointEditorComponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    changeViewToPoint();
  });

  render(pointListElement, pointComponent.getElement());
};


for (let i = 0; i < POINT_COUNT; i++) {
  renderPoint(pointListComponent.getElement(), randomPointsData[i]);
}
