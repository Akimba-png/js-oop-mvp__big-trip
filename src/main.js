import {createMainMenuTemplate} from './view/main-menu.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {CreateTripCostTemplate} from './view/trip-cost.js';
import {createFilterTemplate} from './view/filter.js';
import {createTripBordTemplate} from './view/trip-bord.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {generatePointData} from './mock/point-data-generator.js';


const POINT_COUNT = 20;
const FIRST_POINT_NUMBER = 1;

const randomPointsData = new Array(POINT_COUNT).fill(null).map(generatePointData);


const siteBodyElement = document.querySelector('.page-body');

const render = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};


const menuElement = siteBodyElement.querySelector('.trip-controls__navigation');
render (menuElement, createMainMenuTemplate());

const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
render(tripDetailsElement, createTripInfoTemplate(), 'afterbegin');

const tripInfoElement = tripDetailsElement.querySelector('.trip-info');
render(tripInfoElement, CreateTripCostTemplate());

const filterElement = siteBodyElement.querySelector('.trip-controls__filters');
render(filterElement, createFilterTemplate());

const tripBordElement = siteBodyElement.querySelector('.trip-events');
render(tripBordElement, createTripBordTemplate());

const eventListElement = tripBordElement.querySelector('.trip-events__list');
render(eventListElement, createEditPointTemplate(randomPointsData[0]));
// render(eventListElement, createEditPointTemplate());


for (let i = FIRST_POINT_NUMBER; i < POINT_COUNT; i++) {
  render(eventListElement, createPointTemplate(randomPointsData[i]));
}


// dayjs(date).format('D MMMM')
// daysjs().isAfter(date, 'D') - просрочена ли задача, true/false
// Все dayjs вынести в отдельные функции в utils (в моках можно оставить)
