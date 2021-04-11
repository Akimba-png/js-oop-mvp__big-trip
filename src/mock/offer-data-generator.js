import {generateRandomArray} from '../utils.js';

const MAX_OFFERS_NUMBER = 5;

const generateRandomOffer = (type) => {
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
    {
      title: 'Add meal',
      price: 15,
    },
    {
      title: 'Choose seats',
      price: 5,
    },
    {
      title: 'Travel by train',
      price: 40,
    },
  ];
  return {
    type,
    offers: generateRandomArray(possibleOffers, 0, MAX_OFFERS_NUMBER),
  };
};


const generateRandomOffers = (types) => {
  return types.map((type) => generateRandomOffer(type));
};


export {generateRandomOffers};
