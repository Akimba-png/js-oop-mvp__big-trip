import Observer from './../utils/observer.js';


export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
    // console.log(this._offers)
    //notify ?
  }

  getOffers() {
    return this._offers;
  }
}
