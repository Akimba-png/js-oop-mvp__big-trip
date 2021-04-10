import {types, cites} from './../const.js';
import {getRandomInteger, getRandomArrayElement, generateRandomArray, pickOffersDependOnType} from '../utils.js';
import {generateRandomOffers} from './offer-data-generator.js';
import dayjs from 'dayjs';

const Gap = {
  MIN: 1,
  MAX: 5,
};

const Period = {
  START_DATE_MIN: -7,
  START_DATE_MAX: -4,
  DATE_FROM_MIN: 60,
  DATE_FROM_MAX: 120,
  DATE_TO_MIN: 180,
  DATE_TO_MAX: 2880,
  BASE_PRICE_MIN: 20,
  BASE_PRICE_MAX: 1500,
};


const generatePicture = () => {
  return {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
  };
};


const generateDestination = (cites, interval) => {
  const PossibleDescriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];
  return {
    name: getRandomArrayElement(cites),
    description: generateRandomArray(PossibleDescriptions, interval.MIN, interval.MAX).join(' '),
    pictures: new Array(getRandomInteger(interval.MIN, interval.MAX)).fill(null).map(generatePicture),
  };
};


const createDateGenerator = () => {
  let startDate = dayjs().add(getRandomInteger(Period.START_DATE_MIN, Period.START_DATE_MAX), 'd');
  return () => {
    const dateFrom = dayjs(startDate).add(getRandomInteger(Period.DATE_FROM_MIN, Period.DATE_FROM_MAX), 'm').toDate();
    const dateTo = dayjs(dateFrom).add(getRandomInteger(Period.DATE_TO_MIN, Period.DATE_TO_MAX), 'm').toDate();
    startDate = dateTo;
    return {
      dateFrom,
      dateTo,
    };
  };
};
const generateDate = createDateGenerator();


const generatePointData = () => {
  const type = getRandomArrayElement(types);
  const offers = generateRandomOffers(types);
  const dateInterval = generateDate();
  return {
    type,
    offers: pickOffersDependOnType(type, offers),
    destination: generateDestination(cites, Gap),
    basePrice: getRandomInteger(Period.BASE_PRICE_MIN, Period.BASE_PRICE_MAX),
    dateFrom: dateInterval.dateFrom,
    dateTo: dateInterval.dateTo,
    isFavorite: Boolean(getRandomInteger()),
  };
};


export {generatePointData};
