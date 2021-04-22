import TripPresenter from './presenter/trip.js';
import MainMenuView from './view/main-menu.js';
import FilterView from './view/filter.js';
import {generatePointData} from './mock/point-data-generator.js';
import {generateFilterData} from './mock/filter-data-generator.js';
import {render} from './utils/render.js';


const POINT_COUNT = 20;

const siteBodyElement = document.querySelector('.page-body');
const menuElement = siteBodyElement.querySelector('.trip-controls__navigation');
const filterElement = siteBodyElement.querySelector('.trip-controls__filters');
const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
const tripBoardElement = siteBodyElement.querySelector('.trip-events');


const randomPointsData = new Array(POINT_COUNT).fill(null).map(generatePointData);
const filterData = generateFilterData(randomPointsData);


render(menuElement, new MainMenuView());
render(filterElement, new FilterView(filterData));


const tripPresenter = new TripPresenter(tripBoardElement, tripDetailsElement);
tripPresenter.init(randomPointsData);
