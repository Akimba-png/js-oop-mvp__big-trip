import PointView from './../view/point.js';
import PointEditorView from './../view/point-editor.js';
import {render, replace, remove} from './../utils/render.js';
import {isEscEvent} from './../utils/common.js';
import {isDateTheSame, isOffersTheSame} from './../utils/point.js';
import {UserAction, UpdateType} from './../const.js';
import {pickElementDependOnValue} from '../utils/point.js';

const EDIT_MODE = 'edit_mode';

const Mode = {
  POINT: 'point',
  EDITOR: 'editor',
};


export default class Point {
  constructor(pointListContainer, changeData, changeMode, offers, destinations) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offers = offers;
    this._destinations = destinations;

    this._pointComponent = null;
    this._pointEditorComponent = null;
    this._pointMode = Mode.POINT;

    this._changeViewToPoint = this._changeViewToPoint.bind(this);
    this._changeViewToEdit = this._changeViewToEdit.bind(this);
    this._onEditorPointEscKeydown = this._onEditorPointEscKeydown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormDelete = this._onFormDelete.bind(this);
    this._changeFavoriteStatus = this._changeFavoriteStatus.bind(this);
  }


  init(point) {
    this._point = point;

    const previousPointComponent = this._pointComponent;
    const previousPointEditorComponent = this._pointEditorComponent;

    this._pointComponent = new PointView(point);
    this._pointEditorComponent = new PointEditorView(this._offers, this._destinations, point, EDIT_MODE);

    this._pointComponent.setRollOutClickListener(this._changeViewToEdit);
    this._pointComponent.setFavoriteClickListener(this._changeFavoriteStatus);
    this._pointEditorComponent.setRollUpClickListener(this._changeViewToPoint);
    this._pointEditorComponent.setSubmitListener(this._onFormSubmit);
    this._pointEditorComponent.setDeleteListener(this._onFormDelete);


    if (previousPointComponent === null || previousPointEditorComponent === null) {
      render(this._pointListContainer, this._pointComponent);
      return;
    }


    if (this._pointMode === Mode.POINT) {
      replace(this._pointComponent, previousPointComponent);
    }


    if (this._pointMode === Mode.EDITOR) {
      replace(this._pointComponent, previousPointEditorComponent);
    }


    remove(previousPointComponent);
    remove(previousPointEditorComponent);
  }


  pickOffers(point, offers) {
    pickElementDependOnValue(point, offers);
  }


  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditorComponent);
  }


  resetView() {
    if (this._pointMode !== Mode.POINT) {
      this._changeViewToPoint();
    }
  }


  _onEditorPointEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._changeViewToPoint();
    }
  }


  _changeViewToPoint() {
    this._pointEditorComponent.resetInput(this._point);
    replace(this._pointComponent, this._pointEditorComponent);
    document.removeEventListener('keydown', this._onEditorPointEscKeydown);
    this._pointMode = Mode.POINT;
  }


  _changeViewToEdit() {
    replace(this._pointEditorComponent, this._pointComponent);
    document.addEventListener('keydown', this._onEditorPointEscKeydown);
    this._changeMode();
    this._pointMode = Mode.EDITOR;
  }


  _onFormSubmit(point) {
    this._changeViewToPoint();

    const isMinorUpdate = (!isDateTheSame(this._point.dateFrom, point.dateFrom) ||
    !isDateTheSame(this._point.dateTo, point.dateTo) ||
    !(this._point.basePrice === point.basePrice)) || !isOffersTheSame(this._point, point);

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  }


  _onFormDelete(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }


  _changeFavoriteStatus() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}),
    );
  }
}
