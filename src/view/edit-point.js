import dayjs from 'dayjs';
import {types, cites, DateFormat} from './../const.js';
import {getRandomInteger, getRandomArrayElement, humanizeDate} from './../utils.js';

const createEventTypeItemTemplate = (availableTypes, currentType = '') => {
  return availableTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`,
  ).join('');
};


const createDestinationOptionTemplate = (cites) => {
  return cites.map((city) => `<option value="${city}"></option>`).join('');
};


const createEventOfferTemplate = (offers) => {
  return offers.length > 0 ?
    `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers.map(({title, price}) => {
    const offerClassName = title.split(' ').pop();
    const checkedAttribute = getRandomInteger() ? 'checked' : '';
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerClassName}-1" type="checkbox" name="event-offer-${offerClassName}" ${checkedAttribute}>
    <label class="event__offer-label" for="event-offer-${offerClassName}-1">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </label>
    </div>`;}).join('')}
    </div></section>` : '';
};


const createPhotoContainer = (destination) => {
  return destination.pictures.length > 0 ?
    `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${destination.pictures.map((photo) =>
    `<img class="event__photo" src="${photo.src}" alt="Event photo"></img>`).join('')}
    </div></div>`
    : '';
};


export const createEditPointTemplate = (pointData = {}) => {
  const {
    type = getRandomArrayElement(types),
    offers = [],
    destination = {
      name: getRandomArrayElement(cites),
      description: '',
      pictures: '',
    },
    dateFrom = dayjs(),
    dateTo = dayjs(),
    basePrice = '',

  } = pointData;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${createEventTypeItemTemplate(types, type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationOptionTemplate(cites)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, DateFormat.DATE_HOUR)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, DateFormat.DATE_HOUR)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createEventOfferTemplate(offers)}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          ${createPhotoContainer(destination)}
        </section>
      </section>
    </form>
  </li>`;
};
