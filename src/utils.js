import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DAYS_COUNT = 10;

const TimeFormat = {
  HOUR_PER_DAY: 1440,
  MINUTE_PER_HOUR: 60,
  MILLISECOND_PER_MINUTE: 60000,
};

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};


const getRandomArrayElement = (array) => {
  return array[(getRandomInteger(0, (array.length - 1)))];
};


const generateRandomArray = (array, minLength = 0, maxLength = array.length) => {
  let temp;
  let j;
  for (let i = array.length - 1; i > 0; i--) {
    j = getRandomInteger(0, i);
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  array.length = getRandomInteger(minLength, maxLength);
  return array;
};


const pickOffersDependOnType = (type, offers) => {
  return offers.find((item) => item.type === type).offers;
};


const dateConverter = {
  'D MMM': (date) => dayjs(date).format('D MMM'),
  'HH:mm': (date) => dayjs(date).format('HH:mm'),
  'YYYY-MM-DDTHH:mm': (date) => dayjs(date).format('YYYY-MM-DDTHH:mm'),
  'DD/MM/YY HH:mm': (date) => dayjs(date).format('DD/MM/YY HH:mm'),
};
const humanizeDate = (date, format = 'HH:mm') => dateConverter[format](date);


const compareTwoDates = (dateA, dateB) => dayjs(dateA).diff(dateB);


const getTimeDuration = (initialDate, expirationDate) => {
  const difference = compareTwoDates(expirationDate, initialDate);
  const duration = dayjs.duration(difference).$d;

  const day = duration.days < DAYS_COUNT ? `0${duration.days}D` : `${duration.days}D`;
  const hour = duration.hours < DAYS_COUNT ? `0${duration.hours}H` : `${duration.hours}H`;
  const minute = duration.minutes < DAYS_COUNT ? `0${duration.minutes}M` : `${duration.minutes}M`;
  const total = (difference / TimeFormat.MILLISECOND_PER_MINUTE) > TimeFormat.HOUR_PER_DAY ? `${day} ${hour} ${minute}` : (difference / TimeFormat.MILLISECOND_PER_MINUTE) > TimeFormat.MINUTE_PER_HOUR ? `${hour} ${minute}` : minute;
  return total;
};

const isDateExpired = (date) => dayjs().isAfter(date, 'm');
const isDateInFuture = (date) => dayjs().isBefore(date, 'm');
const isDateCurrent = (date) => dayjs().isSame(date, 'm');

const isEventContinues = (dateFrom, dateTo) => {
  return isDateExpired(dateFrom) && isDateInFuture(dateTo);
};


export {getRandomInteger, getRandomArrayElement, generateRandomArray, pickOffersDependOnType,
  humanizeDate, getTimeDuration, isDateExpired, isDateInFuture, isDateCurrent, isEventContinues, compareTwoDates};
