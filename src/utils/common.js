import {Index} from './../const.js';

export const getRandomInteger = (a = 0, b = Index.NEXT) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(Math.random() * (upper - lower + Index.NEXT) + lower);
};


export const getRandomArrayElement = (array) => {
  return array[(getRandomInteger(0, (array.length - 1)))];
};


export const isEscEvent = (evt) => {
  return evt.key === ('Escape' || 'Esc');
};


export const isOnline = () => {
  return window.navigator.onLine;
};
