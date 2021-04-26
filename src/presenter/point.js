import PointView from './../view/point.js';
import PointEditorView from './../view/point-editor.js';
import {render, replace, remove} from './../utils/render.js';
import {isEscEvent} from './../utils/common.js';

const Mode = {
  POINT: 'point',
  EDITOR: 'editor',
};


export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditorComponent = null;
    this._pointMode = Mode.POINT;

    this._changeViewToPoint = this._changeViewToPoint.bind(this);
    this._changeViewToEdit = this._changeViewToEdit.bind(this);
    this._onEditorPointEscKeydown = this._onEditorPointEscKeydown.bind(this);
    this._changeFavoriteStatus = this._changeFavoriteStatus.bind(this);
  }


  init(point) {
    this._point = point;

    const previousPointComponent = this._pointComponent;
    const previousPointEditorComponent = this._pointEditorComponent;

    this._pointComponent = new PointView(point);
    this._pointEditorComponent = new PointEditorView(point);

    this._pointComponent.setRollOutClickListener(this._changeViewToEdit);
    this._pointComponent.setFavoriteClickListener(this._changeFavoriteStatus);
    this._pointEditorComponent.setRollUpClickListener(this._changeViewToPoint);
    this._pointEditorComponent.setSubmitListener(this._changeViewToPoint);


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


  _changeFavoriteStatus() {
    this._changeData(
      Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}),
    );
  }
}
