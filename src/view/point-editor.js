import SmartView from './smart.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {types, cities, DateFormat} from '../const.js';
import {getRandomInteger, getRandomArrayElement} from '../utils/common.js';
import {humanizeDate, pickElementDependOnValue, compareTwoDates} from '../utils/point.js';
import {generatedOffers, generatedDescriptions} from './../mock/point-data-generator.js';


const EMPTY_POINT = {
  type: getRandomArrayElement(types),
  offers: [],
  destination: {
    name: getRandomArrayElement(cities),
    description: '',
    pictures: '',
  },
  dateFrom: dayjs(),
  dateTo: dayjs(),
  basePrice: '',
};

const TRUE_FLAG = true;


const createEventTypeItemTemplate = (availableTypes, currentType = '') => {
  return availableTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`,
  ).join('');
};


const createDestinationOptionTemplate = (cities) => {
  return cities.map((city) => `<option value="${city}"></option>`).join('');
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


const createEventDestinationTemplate = (destination) => {
  return destination.description.length > 0 || destination.pictures.length > 0? `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description}</p>
  ${createPhotoContainer(destination)}
</section>` : '';
};


const createPointEditorTemplate = (pointData) => {
  const {type, dateFrom, dateTo, basePrice, offers, destination} = pointData;
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
            ${createDestinationOptionTemplate(cities)}
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
        ${createEventDestinationTemplate(destination)}
      </section>
    </form>
  </li>`;
};


export default class PointEditor extends SmartView {
  constructor(pointData = EMPTY_POINT) {
    super();
    this._pointState = PointEditor.parsePointDataToState(pointData);
    this._datePickerStartDate = null;
    this._datePickerExpirationDate = null;

    this._onRollUpClick = this._onRollUpClick.bind(this);
    this._onPointEditorSubmit = this._onPointEditorSubmit.bind(this);
    this._onPointTypeChange = this._onPointTypeChange.bind(this);
    this._onPointInput = this._onPointInput.bind(this);
    this._onDateFromChange = this._onDateFromChange.bind(this);
    this._onDateToChange = this._onDateToChange.bind(this);
    this._setInnerListeners();
    this._setDatePicker(this._datePickerStartDate, TRUE_FLAG);
    this._setDatePicker(this._datePickerExpirationDate);
  }


  static parsePointDataToState(pointData) {
    return Object.assign(
      {},
      pointData,
    );
  }


  static parseStateToPointData(state) {
    state = Object.assign(
      {},
      state,
    );
    return state;
  }


  getTemplate() {
    return createPointEditorTemplate(this._pointState);
  }


  resetInput(pointData) {
    this.updateData(PointEditor.parsePointDataToState(pointData));
  }


  setRollUpClickListener(callback) {
    this._callback.rollUpClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onRollUpClick);
  }


  setSubmitListener(callback) {
    this._callback.pointEditorSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._onPointEditorSubmit);
  }


  restoreListeners() {
    this._setInnerListeners();
    this.setRollUpClickListener(this._callback.rollUpClick);
    this.setSubmitListener(this._callback.pointEditorSubmit);
    this._setDatePicker(this._datePickerStartDate, TRUE_FLAG);
    this._setDatePicker(this._datePickerExpirationDate);
  }


  _setInnerListeners() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._onPointTypeChange);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._onPointInput);
  }


  _onRollUpClick() {
    this._callback.rollUpClick();
  }


  _onPointEditorSubmit(evt) {
    evt.preventDefault();
    this._callback.pointEditorSubmit(PointEditor.parseStateToPointData(this._pointState));
  }


  _onPointTypeChange(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.updateData({
      type: evt.target.value,
      offers: pickElementDependOnValue(evt.target.value, generatedOffers),
    });
  }


  _onPointInput(evt) {
    if (!cities.includes(evt.target.value)) {
      evt.target.setCustomValidity('Необходимо выбрать одно из предложенных направлений');
    }
    else {
      evt.target.setCustomValidity('');
      evt.preventDefault();
      this.updateData({
        destination: pickElementDependOnValue(evt.target.value, generatedDescriptions, TRUE_FLAG),
      });
    }
    evt.target.reportValidity();
  }


  _setDatePicker(datePicker, flag) {
    if (datePicker) {
      datePicker.destroy();
      datePicker = null;
    }

    if (flag) {
      datePicker = flatpickr(
        this.getElement().querySelector('#event-start-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._pointState.dateFrom,
          onChange: this._onDateFromChange,
        },
      );
      return;
    }

    datePicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._pointState.dateTo,
        onChange: this._onDateToChange,
      },
    );
  }


  _onDateFromChange(userInput) {
    if (compareTwoDates(this._pointState.dateTo, userInput) < 0) {
      this.updateData({
        dateFrom: userInput,
        dateTo: userInput,
      });
      return;
    }
    this.updateData({
      dateFrom: userInput,
    });
  }


  _onDateToChange(userInput) {
    if (compareTwoDates(userInput, this._pointState.dateFrom) < 0) {
      userInput = this._pointState.dateFrom;
    }
    this.updateData({
      dateTo: userInput,
    });
  }
}
