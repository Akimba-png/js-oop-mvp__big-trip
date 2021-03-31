import {createMainMenuTemplate} from './view/main-menu.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {tripCostTemplate} from './view/trip-cost.js';
import {createFilterTemplate} from './view/filter.js';
import {createTripBordTemplate} from './view/trip-bord.js';
import {createNewPointTemplate} from './view/new-point.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';

const POINT_COUNT = 3;
const siteBodyElement = document.querySelector('.page-body');

const render = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};


const menuElement = siteBodyElement.querySelector('.trip-controls__navigation');
render (menuElement, createMainMenuTemplate());

const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
render(tripDetailsElement, createTripInfoTemplate(), 'afterbegin');

const tripInfoElement = tripDetailsElement.querySelector('.trip-info');
render(tripInfoElement, tripCostTemplate());

const filterElement = siteBodyElement.querySelector('.trip-controls__filters');
render(filterElement, createFilterTemplate());

const tripBordElement = siteBodyElement.querySelector('.trip-events');
render(tripBordElement, createTripBordTemplate());

const eventListElement = tripBordElement.querySelector('.trip-events__list');
render(eventListElement, createEditPointTemplate());
render(eventListElement, createNewPointTemplate());

for (let i = 0; i < POINT_COUNT; i++) {
  render(eventListElement, createPointTemplate());
}
