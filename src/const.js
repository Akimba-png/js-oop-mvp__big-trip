const types = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const cities = ['Cartagena', 'Santiago', 'Tortuga', 'Jamaica', 'Barbados', 'Havana'];

const DateFormat = {
  DAY_MONTH: 'D MMM',
  HOUR_MINUTE: 'hh:mm',
  ISO: 'YYYY-MM-DDTHH:mm',
  DATE_HOUR: 'DD/MM/YY HH:mm',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export {types, cities, DateFormat, SortType};
