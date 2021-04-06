import {getRandomInteger, getRandomArrayElement, generateRandomArray} from '../utils.js';
import dayjs from 'dayjs';

const types = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const cites = ['Amsterdam', 'Chamonix', 'Geneva'];
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

const Gap = {
  MIN: 1,
  MAX: 5,
};


const generatePicture = () => {
  return {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
  };
};


// Функций генерации массива дополнительных предложений случайной длины
const generateRandomOffers = (type) => {
  const possibleOffers = [
    {
      title: 'Rent a car',
      price: 200,
    },
    {
      title: 'Add luggage',
      price: 30,
    },
    {
      title: 'Switch to comfort',
      price: 100,
    },
    {
      title: 'Order Uber',
      price: 20,
    },
    {
      title: 'Add breakfast',
      price: 50,
    },
  ];
  return {
    type,
    offers: generateRandomArray(possibleOffers),
  };
};


const createDateGenerator = () => {
  let startDate = dayjs().add(getRandomInteger(-7, - 4), 'd');
  return () => {
    const dateFrom = dayjs(startDate).add(getRandomInteger(1, 2), 'h').toDate();
    const dateTo = dayjs(dateFrom).add(getRandomInteger(3, 48), 'h').toDate();
    startDate = dateTo;
    return {
      dateFrom,
      dateTo,
    };
  };
};
const generateDate = createDateGenerator();


const generatePointData = () => {
  // Генерируем случайный тип точки
  const type = getRandomArrayElement(types);
  // Для каждого возможного типа точки генерируем массив доп. опций
  // произвольной последовательности и длины
  const randomOffers = types.map((type) => generateRandomOffers(type));
  const dateInterval = generateDate();

  return {
    type,
    // В зависимости от типа точки выбираем доп. опции
    // из сгенерированного массива
    offers: randomOffers.find((item) => item.type === type).offers,
    destination: {
      name: getRandomArrayElement(cites),
      description: generateRandomArray(PossibleDescriptions, Gap.MIN, Gap.MAX).join(' '),
      pictures: new Array(getRandomInteger(Gap.MIN, Gap.MAX)).fill(null).map(generatePicture),
    },
    basePrice: getRandomInteger(20, 1500),
    dateFrom: dateInterval.dateFrom,
    dateTo: dateInterval.dateTo,
    isFavorite: Boolean(getRandomInteger()),
  };
};

export {generatePointData};
