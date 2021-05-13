import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import MainMenuView from './view/main-menu.js';
import ButtonNewView from './view/button-new.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import {generatePointData} from './mock/point-data-generator.js';
import {generateRandomOffers} from './mock/offer-data-generator';
import {render} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './const.js';


const POINT_COUNT = 20;
const DISABLED_STATUS = 'disabled';

const siteBodyElement = document.querySelector('.page-body');
const menuElement = siteBodyElement.querySelector('.trip-controls__navigation');
const filterElement = siteBodyElement.querySelector('.trip-controls__filters');
const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
const tripBoardElement = siteBodyElement.querySelector('.trip-events');


const offersModel = new OffersModel();
const randomOffersData = generateRandomOffers();
offersModel.setOffers(randomOffersData);
const allTypeOffers = offersModel.getOffers();

const randomPointsData = new Array(POINT_COUNT).fill(null).map(generatePointData);

const pointsModel = new PointsModel();
pointsModel.setPoints(randomPointsData);

const filterModel = new FilterModel();


const mainMenuComponent = new MainMenuView();
render(menuElement, mainMenuComponent);

const buttonNewComponent = new ButtonNewView();
render(tripDetailsElement, buttonNewComponent);


const onNewPointClose = () => {
  buttonNewComponent.getElement().removeAttribute(DISABLED_STATUS);
  // mainMenuComponent.setActiveItem(MenuItem.TABLE);
};


const onMenuClick = (menuItem) => {
  switch(menuItem) {
    case MenuItem.NEW_EVENT:
      tripPresenter.destroy();
      filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERYTHING)
      tripPresenter.init();
      tripPresenter.createPoint(onNewPointClose);
      buttonNewComponent.getElement().setAttribute(DISABLED_STATUS, DISABLED_STATUS);
      break;
    case MenuItem.TABLE:
      tripPresenter.init();
      buttonNewComponent.getElement().removeAttribute(DISABLED_STATUS, DISABLED_STATUS);

      // console.log(menuItem)
      // something happens;
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      buttonNewComponent.getElement().setAttribute(DISABLED_STATUS, DISABLED_STATUS);

      // mainMenuComponent.setActiveItem(menuItem)
      // console.log(menuItem)
      // something another happens
      break;
    default:
      throw new Error('Unknown menu-item. Check MenuItem value');
  }
};

mainMenuComponent.setMenuListener(onMenuClick);
buttonNewComponent.setButtonNewListener(onMenuClick);


const tripPresenter = new TripPresenter(tripBoardElement, tripDetailsElement, pointsModel, filterModel, offersModel);
tripPresenter.init();


const filterPresenter = new FilterPresenter(filterElement, filterModel, pointsModel);
filterPresenter.init();

export {allTypeOffers};
