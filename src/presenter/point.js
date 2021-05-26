import PointView from './../view/point.js';
import PointEditorView from './../view/point-editor.js';
import {render, replace, remove} from './../utils/render.js';
import {isEscEvent, isOnline} from './../utils/common.js';
import {isDateTheSame, isOffersTheSame} from './../utils/point.js';
import {UserAction, UpdateType, FlagMode} from './../const.js';
import {pickElementDependOnValue} from '../utils/point.js';
import {toast} from './../utils/toast.js';

const EDIT_MODE = 'edit_mode';

export const FormState = {
  ABORTING: 'aborting',
  SAVING: 'saving',
  DELETING: 'deleting',
};

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
      this._pointMode = Mode.POINT;
    }


    remove(previousPointComponent);
    remove(previousPointEditorComponent);
  }


  setViewFormState(state) {
    const resetState = () => {
      this._pointEditorComponent.updateData({
        isSaving: FlagMode.FALSE,
        isDeleting: FlagMode.FALSE,
        isDisabled: FlagMode.FALSE,
      });
    };
    switch (state) {
      case FormState.SAVING:
        this._pointEditorComponent.updateData({
          isSaving: FlagMode.TRUE,
          isDisabled: FlagMode.TRUE,
        });
        break;
      case FormState.DELETING:
        this._pointEditorComponent.updateData({
          isDeleting: FlagMode.TRUE,
          isDisabled: FlagMode.TRUE,
        });
        break;
      case FormState.ABORTING:
        this._pointComponent.shake(resetState);
        this._pointEditorComponent.shake(resetState);
        break;
      default:
        throw new Error('Unknown form-state. Check FormState value');
    }
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


  _changeViewToPoint() {
    this._pointEditorComponent.resetInput(this._point);
    replace(this._pointComponent, this._pointEditorComponent);
    document.removeEventListener('keydown', this._onEditorPointEscKeydown);
    this._pointMode = Mode.POINT;
  }


  _changeViewToEdit() {
    if (!isOnline()) {
      toast();
      return;
    }
    replace(this._pointEditorComponent, this._pointComponent);
    document.addEventListener('keydown', this._onEditorPointEscKeydown);
    this._changeMode();
    this._pointMode = Mode.EDITOR;
  }


  _changeFavoriteStatus() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}),
    );
  }


  _onEditorPointEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._changeViewToPoint();
    }
  }


  _onFormSubmit(point) {
    if (!isOnline()) {
      toast();
      this.setViewFormState(FormState.SAVING);
      this.setViewFormState(FormState.ABORTING);
      return;
    }
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
    if (!isOnline()) {
      toast();
    }
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
