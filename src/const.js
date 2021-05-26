export const types = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const FlagMode = {
  TRUE: true,
  FALSE: false,
};

export const Tag = {
  INPUT: 'INPUT',
  A: 'A',
  BUTTON: 'BUTTON',
};

export const DateFormat = {
  DAY_MONTH: 'D MMM',
  HOUR_MINUTE: 'hh:mm',
  ISO: 'YYYY-MM-DDTHH:mm',
  DATE_HOUR: 'DD/MM/YY HH:mm',
};

export const SortType = {
  DATE: 'date',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_POINT: 'update_point',
  ADD_POINT: 'add_point',
  DELETE_POINT: 'delete_point',
};

export const UpdateType = {
  INIT_DESTINATIONS: 'init_destinations',
  INIT_POINTS: 'init_points',
  INIT_OFFERS: 'init_offers',
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const Index = {
  PREVIOUS: -1,
  NEXT: 1,
};

export const MenuItem = {
  TABLE: 'table',
  STATS: 'stats',
  NEW_EVENT: 'new-event',
};

export const DataType = {
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
  POINTS: 'points',
};
