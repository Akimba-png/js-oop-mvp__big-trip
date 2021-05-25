import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import MainMenuView from './view/main-menu.js';
import ButtonNewView from './view/button-new.js';
import StatisticsView from './view/statistics.js';
import ErrorView from './view/error.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {render, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType, FlagMode, DataType} from './const.js';
import {isOnline} from './utils/common.js';
import {toast, toastPermanent, toastRemove} from './utils/toast.js';

const AUTHORIZATION_KEY = 'Basic 2agPYxDu3DyHxrKWBcdGEH';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const STORE_VERSION = 'v1';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;
const STORE_OFFER_PREFIX = 'bigtrip-offer-localstorage';
const STORE_OFFER_NAME = `${STORE_OFFER_PREFIX}-${STORE_VERSION}`;
const STORE_DESTINATION_PREFIX = 'bigtrip-destination-localstorage';
const STORE_DESTINATION_NAME = `${STORE_DESTINATION_PREFIX}-${STORE_VERSION}`;

const siteBodyElement = document.querySelector('.page-body');
const headerElement = siteBodyElement.querySelector('.page-header__container');
const mainElement = siteBodyElement.querySelector('.page-main__container');
const menuElement = siteBodyElement.querySelector('.trip-controls__navigation');
const filterElement = siteBodyElement.querySelector('.trip-controls__filters');
const tripDetailsElement = siteBodyElement.querySelector('.trip-main');
const tripBoardElement = siteBodyElement.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION_KEY);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const storeOffer = new Store(STORE_OFFER_NAME, window.localStorage);
const apiWithProviderOffer = new Provider(api, storeOffer);
const storeDestination = new Store(STORE_DESTINATION_NAME, window.localStorage);
const apiWithProviderDestination = new Provider(api, storeDestination);


const offersModel = new OffersModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();

const mainMenuComponent = new MainMenuView();
render(menuElement, mainMenuComponent);
const buttonNewComponent = new ButtonNewView();
render(tripDetailsElement, buttonNewComponent);
const errorView = new ErrorView();

const tripPresenter = new TripPresenter(tripBoardElement, tripDetailsElement, pointsModel, filterModel, offersModel, destinationsModel, apiWithProvider);
const filterPresenter = new FilterPresenter(filterElement, filterModel, pointsModel);

let loadStatus = FlagMode.TRUE;
let statisticsComponent = null;

const onNewPointClose = () => {
  buttonNewComponent.setEnabledStatus();
};

const onMenuClick = (menuItem) => {
  switch(menuItem) {
    case MenuItem.NEW_EVENT:
      if (!isOnline()) {
        toast();
        break;
      }
      tripPresenter.destroy();
      filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init(onNewPointClose);
      tripPresenter.createPoint();
      buttonNewComponent.setDisabledStatus();
      break;
    case MenuItem.TABLE:
      remove(statisticsComponent);
      filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init(onNewPointClose);
      filterPresenter.init();
      buttonNewComponent.setEnabledStatus();
      headerElement.classList.toggle('page-header__container--statistics');
      mainElement.classList.toggle('page-main__container--statistics');
      break;
    case MenuItem.STATS:
      filterPresenter.init(FlagMode.TRUE);
      tripPresenter.destroy();
      buttonNewComponent.setDisabledStatus();
      headerElement.classList.toggle('page-header__container--statistics');
      mainElement.classList.toggle('page-main__container--statistics');
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(mainElement, statisticsComponent);
      break;
    default:
      throw new Error('Unknown menu-item. Check MenuItem value');
  }
};

const onLoadError = () => {
  if (!loadStatus) {
    return;
  }
  loadStatus = FlagMode.FALSE;
  tripPresenter.destroy();
  render(tripBoardElement, errorView);
  filterPresenter.init(FlagMode.TRUE, FlagMode.TRUE);
  mainMenuComponent.removeMenuListener();
  buttonNewComponent.setDisabledStatus();
};

tripPresenter.init(onNewPointClose);
filterPresenter.init();

apiWithProvider.getData(DataType.POINTS).then((response) => {
  pointsModel.setPoints(UpdateType.INIT_POINTS, response);
  mainMenuComponent.setMenuListener(onMenuClick);
  buttonNewComponent.setButtonNewListener(onMenuClick);
})
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT_POINTS, []);
    mainMenuComponent.setMenuListener(onMenuClick);
    buttonNewComponent.setButtonNewListener(onMenuClick);
  });


apiWithProviderOffer.getData(DataType.OFFERS).then((response) => {
  offersModel.setOffers(UpdateType.INIT_OFFERS, response);
})
  .catch(() => {
    onLoadError();
  });


apiWithProviderDestination.getData(DataType.DESTINATIONS).then((response) => {
  destinationsModel.setDestinations(UpdateType.INIT_DESTINATIONS, response);
})
  .catch(() => {
    onLoadError();
  });


window.addEventListener('load', () => {
  navigator.serviceWorker.register('sw.js');
  if (!isOnline()) {
    toastPermanent();
  }
});


window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
  toastRemove();
});


window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toastPermanent();
});
