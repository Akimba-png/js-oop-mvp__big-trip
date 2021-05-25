import SmartView from './smart.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {types, DateFormat, FlagMode, Index, Tag} from '../const.js';
import {getRandomArrayElement, isOnline} from '../utils/common.js';
import {humanizeDate, pickElementDependOnValue, compareTwoDates} from '../utils/point.js';

const TIME_GAP = 5;

const ValidityMessage = {
  DESTINATION: 'Необходимо выбрать одно из предложенных направлений',
  PRICE: 'Без цифр не отдохнуть(',
};

const EMPTY_POINT = {
  type: getRandomArrayElement(types),
  offers: [],
  destination: {
    name: '',
    description: '',
    pictures: '',
  },
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().add(TIME_GAP, 'm').toDate(),
  basePrice: '',
};


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


const createEventOfferTemplate = (type, offers, allTypeOffers, isDisabled) => {
  let index = 0;
  const availableOffers = pickElementDependOnValue(type, allTypeOffers);
  return `<section class="event__section  event__section--offers">
    ${availableOffers.length > 0 ? `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${availableOffers.map(({title, price}) => {
    const offerClassName = title.split(' ').pop() + '&ndash;' + index++;
    const checkedAttribute = offers.some((offer) => offer.title === title) ? 'checked' : '';
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerClassName}" type="checkbox" name="event-offer-${offerClassName}" value="${title}" ${checkedAttribute} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${offerClassName}">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </label>
    </div>`;}).join('')}
    </div>` : ''}
    </section>`;
};


const createPhotoContainer = (destination) => {
  if (isOnline()) {
    return destination.pictures.length > 0 ?
      `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${destination.pictures.map((photo) =>
    `<img class="event__photo" src="${photo.src}" alt="Event photo"></img>`).join('')}
      </div></div>`
      : '';
  }
  return '';
};


const createEventDestinationTemplate = (destination) => {
  return destination.description.length > 0 || destination.pictures.length > 0? `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description}</p>
  ${createPhotoContainer(destination)}
</section>` : '';
};


const createPointEditorTemplate = (pointData, allTypeOffers, cities, pointMode) => {
  const {type, dateFrom, dateTo, basePrice, offers, destination, isSaving, isDeleting, isDisabled} = pointData;
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" required placeholder="Выберите направление" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${createDestinationOptionTemplate(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, DateFormat.DATE_HOUR)}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, DateFormat.DATE_HOUR)}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" minlength="1" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : pointMode ? 'Delete' : 'Cancel'}</button>
        ${pointMode ? `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">
        ${createEventOfferTemplate(type, offers, allTypeOffers, isDisabled)}
        ${createEventDestinationTemplate(destination)}
      </section>
    </form>
  </li>`;
};


export default class PointEditor extends SmartView {
  constructor(offers, destinations, pointData = EMPTY_POINT, pointMode) {
    super();
    this._pointState = PointEditor.parsePointDataToState(pointData);
    this._offers = offers;
    this._destinations = destinations;
    this._pointMode = pointMode;
    this._datePickerStartDate = null;
    this._datePickerExpirationDate = null;
    this._cities = this._getPossibleCities();

    this._onRollUpClick = this._onRollUpClick.bind(this);
    this._onPointEditorSubmit = this._onPointEditorSubmit.bind(this);
    this._onPointEditorDelete = this._onPointEditorDelete.bind(this);
    this._onPointTypeChange = this._onPointTypeChange.bind(this);
    this._onPointInput = this._onPointInput.bind(this);
    this._onDateFromChange = this._onDateFromChange.bind(this);
    this._onDateToChange = this._onDateToChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._onOfferChange = this._onOfferChange.bind(this);

    this._setInnerListeners();
    this._setDatePicker(this._datePickerStartDate, FlagMode.TRUE);
    this._setDatePicker(this._datePickerExpirationDate);
  }


  static parsePointDataToState(pointData) {
    return Object.assign(
      {},
      pointData,
      {
        isSaving: FlagMode.FALSE,
        isDeleting: FlagMode.FALSE,
        isDisabled: FlagMode.FALSE,
      },
    );
  }


  static parseStateToPointData(state) {
    state = Object.assign(
      {},
      state,
    );
    delete state.isSaving;
    delete state.isDeleting;
    delete state.isDisabled;
    return state;
  }


  getTemplate() {
    return createPointEditorTemplate(this._pointState, this._offers, this._cities, this._pointMode);
  }


  removeElement() {
    super.removeElement();
    if (this._datePickerStartDate || this._datePickerExpirationDate) {
      this._datePickerStartDate.destroy();
      this._datePickerStartDate = null;
      this._datePickerExpirationDate.destroy();
      this._datePickerExpirationDate = null;
    }
  }


  resetInput(pointData) {
    this.updateData(PointEditor.parsePointDataToState(pointData));
  }


  setRollUpClickListener(callback) {
    if (this.getElement().querySelector('.event__rollup-btn') !== null) {
      this._callback.rollUpClick = callback;
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onRollUpClick);
    }
  }


  setSubmitListener(callback) {
    this._callback.pointEditorSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._onPointEditorSubmit);
  }


  setDeleteListener(callback) {
    this._callback.pointEditorDelete = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._onPointEditorDelete);
  }


  restoreListeners() {
    this._setInnerListeners();
    this.setRollUpClickListener(this._callback.rollUpClick);
    this.setSubmitListener(this._callback.pointEditorSubmit);
    this.setDeleteListener(this._callback.pointEditorDelete);
    this._setDatePicker(this._datePickerStartDate, FlagMode.TRUE);
    this._setDatePicker(this._datePickerExpirationDate);
  }


  _setInnerListeners() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._onPointTypeChange);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._onPointInput);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._onPriceChange);
    this.getElement().querySelector('.event__section--offers').addEventListener('change', this._onOfferChange);
  }


  _onRollUpClick() {
    this._callback.rollUpClick();
  }


  _onPointEditorSubmit(evt) {
    evt.preventDefault();
    this._callback.pointEditorSubmit(PointEditor.parseStateToPointData(this._pointState));
  }


  _onPointEditorDelete(evt) {
    evt.preventDefault();
    this._callback.pointEditorDelete(PointEditor.parseStateToPointData(this._pointState));
  }


  _onPointTypeChange(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== Tag.INPUT) {
      return;
    }
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }


  _onPointInput(evt) {
    if (!this._cities.includes(evt.target.value)) {
      evt.target.setCustomValidity(`${ValidityMessage.DESTINATION}: ${this._cities.join(', ')}`);
    }
    else {
      evt.target.setCustomValidity('');
      evt.preventDefault();
      this.updateData({
        destination: pickElementDependOnValue(evt.target.value, this._destinations, FlagMode.TRUE),
      });
    }
    evt.target.reportValidity();
  }


  _getPossibleCities() {
    return this._destinations.map((destination) => destination.name);
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
          enableTime: FlagMode.TRUE,
          time_24hr: FlagMode.TRUE,
          onChange: this._onDateFromChange,
        },
      );
      return;
    }

    datePicker  = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._pointState.dateTo,
        enableTime: FlagMode.TRUE,
        time_24hr: FlagMode.TRUE,
        minDate: dayjs(this._pointState.dateFrom).add(TIME_GAP, 'm').toDate(),
        onChange: this._onDateToChange,
      },
    );
  }


  _onDateFromChange(userInput) {
    if (compareTwoDates(this._pointState.dateTo, userInput) < 0) {
      this.updateData({
        dateFrom: dayjs(userInput).toDate(),
        dateTo: dayjs(userInput).add(TIME_GAP, 'm').toDate(),
      });
      return;
    }
    this.updateData({
      dateFrom: dayjs(userInput).toDate(),
    });
  }


  _onDateToChange(userInput) {
    this.updateData({
      dateTo: dayjs(userInput).toDate(),
    });
  }


  _onPriceChange(evt) {
    evt.preventDefault();
    if (!/^\d+$/.test(evt.target.value) || evt.target.value < Index.NEXT) {
      evt.target.setCustomValidity(ValidityMessage.PRICE);
    } else {
      evt.target.setCustomValidity('');
      this.updateData({
        basePrice: parseInt(evt.target.value),
      },
      FlagMode.TRUE,
      );
    }
    evt.target.reportValidity();
  }


  _onOfferChange(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== Tag.INPUT) {
      return;
    }
    const selectedOffer = evt.target.value;
    const index = this._pointState.offers.findIndex((offer) => offer.title === selectedOffer);
    if (index < 0) {
      const availableOffers = pickElementDependOnValue(this._pointState.type, this._offers);
      const newOffer = availableOffers.find((offer) => offer.title === selectedOffer);
      this.updateData({
        offers: [newOffer, ...this._pointState.offers],
      },
      FlagMode.TRUE,
      );
    } else {
      this.updateData({
        offers: [...this._pointState.offers.slice(0, index), ...this._pointState.offers.slice(index + Index.NEXT)],
      },
      FlagMode.TRUE,
      );
    }
  }
}
