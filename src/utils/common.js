// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};


export const getRandomArrayElement = (array) => {
  return array[(getRandomInteger(0, (array.length - 1)))];
};


export const generateRandomArray = (array, minLength = 0, maxLength = array.length) => {
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


export const isEscEvent = (evt) => {
  return evt.key === ('Escape' || 'Esc');
};


export const updatePoint = (points, modifiedPoint) => {
  const index = points.findIndex((point) => point.id === modifiedPoint.id);

  if (index === -1) {
    return points;
  }

  return [
    ...points.slice(0, index), modifiedPoint, ...points.slice(index + 1),
  ];
};
