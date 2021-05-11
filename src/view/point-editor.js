import SmartView from './smart.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {types, cities, DateFormat, TRUE_FLAG} from '../const.js';
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
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
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


const createEventOfferTemplate = (type, offers, allTypeOffers) => {
  const availableOffers = pickElementDependOnValue(type, allTypeOffers);
  return availableOffers.length > 0 ?
    `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${availableOffers.map(({title, price}) => {
    const offerClassName = title.split(' ').pop();
    const checkedAttribute = offers.some((offer) => offer.title === title) ? 'checked' : '';
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerClassName}-1" type="checkbox" name="event-offer-${offerClassName}" value="${title}" ${checkedAttribute}>
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


const createPointEditorTemplate = (pointData, allTypeOffers) => {
  const {type, dateFrom, dateTo, basePrice, offers, destination} = pointData;
  console.log(pointData)
  console.log(offers)
  console.log(allTypeOffers)

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
        ${createEventOfferTemplate(type, offers, allTypeOffers)}
        ${createEventDestinationTemplate(destination)}
      </section>
    </form>
  </li>`;
};


export default class PointEditor extends SmartView {
  constructor(pointData = EMPTY_POINT, offers) {
    super();
    this._pointState = PointEditor.parsePointDataToState(pointData);
    this._offers = offers;
    this._datePickerStartDate = null;
    this._datePickerExpirationDate = null;

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
    this._setDatePicker(this._datePickerStartDate, TRUE_FLAG);
    this._setDatePicker(this._datePickerExpirationDate);
  }


  static parsePointDataToState(pointData) {
    // console.log(pointData)
    // console.log(pointData.type)
    // console.log(allTypeOffers)
    // const availableOffers = pickElementDependOnValue(pointData.type, allTypeOffers);
    // console.log(availableOffers)
    // console.log(pointData.offers)
    // availableOffers.forEach((availableOffer) => {
    //   if (pointData.offers.some((offer) => offer.title === availableOffer.title)) {
    //     pointData.offers.isChecked = true;
    //     return;
    //   }
    // })

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
    return createPointEditorTemplate(this._pointState, this._offers);
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
    this._callback.rollUpClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onRollUpClick);
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
    this._setDatePicker(this._datePickerStartDate, TRUE_FLAG);
    this._setDatePicker(this._datePickerExpirationDate);
  }


  _setInnerListeners() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._onPointTypeChange);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._onPointInput);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._onPriceChange);
    this.getElement().querySelector('.event__available-offers').addEventListener('change', this._onOfferChange)
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


  _onPriceChange(evt) {
    evt.preventDefault();
    if (!/^\d+$/.test(evt.target.value) || evt.target.value < 1) {
      evt.target.setCustomValidity('Не отдохнуть:(');
    } else {
      evt.target.setCustomValidity('');
      this.updateData({
        basePrice: evt.target.value,
      },
      TRUE_FLAG,
      );
    }
    evt.target.reportValidity();
  }


  _onOfferChange(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    // console.log(this._pointState)

    // if (this._pointState.offers.some((offer) => offer.title === evt.target.value)) {
    //   // const index = this._pointState.offers.findIndex((offer) => offer.title === evt.target.value);
    //   // console.log(index)


    // }
    console.log(this._offers)
    const index = this._pointState.offers.findIndex((offer) => offer.title === evt.target.value);
    if (index < 0) {
      const testArray = pickElementDependOnValue(this._pointState.type, this._offers)

      const newOffer = testArray.find((offer) => offer.title === evt.target.value)
      this.updateData({
        offers: [newOffer, ...this._pointState.offers]
      },
      TRUE_FLAG,
      );
    } else {
      // this._pointState.offers.splice(index, 1);
      this.updateData({
        offers: [...this._pointState.offers.slice(0, index), ...this._pointState.offers.slice(index + 1)]
      },
      TRUE_FLAG,
      );
    }

    // console.log(index)

    // console.log(this._pointState.offers)
    // console.log(evt.target.value)
    // this._pointState
    // evt.target.value

  }
}


 // Либо метод из демки:
    // this._points = [
    //   ...this._points.slice(0, index),
    //   ...this._points.slice(index + 1)
    // ];
