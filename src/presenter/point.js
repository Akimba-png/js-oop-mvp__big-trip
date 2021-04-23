import PointView from './../view/point.js';
import PointEditorView from './../view/point-editor.js';
import {render, replace, remove} from './../utils/render.js';
import {isEscEvent} from './../utils/common.js';


export default class Point {
  constructor(pointListContainer) {
    this._pointListContainer = pointListContainer;

    this._pointComponent = null;
    this._pointEditorComponent = null;

    this._changeViewToPoint = this._changeViewToPoint.bind(this);
    this._changeViewToEdit = this._changeViewToEdit.bind(this);
    this._onEditorPointEscKeydown = this._onEditorPointEscKeydown.bind(this);
  }


  init(point) {
    this._point = point;

    const previousPointComponent = this._pointComponent;
    const previousPointEditorComponent = this._pointEditorComponent;

    this._pointComponent = new PointView(point);
    this._pointEditorComponent = new PointEditorView(point);

    this._pointComponent.setClickListener(this._changeViewToEdit);
    this._pointEditorComponent.setClickListener(this._changeViewToPoint);
    this._pointEditorComponent.setSubmitListener(this._changeViewToPoint);


    if (previousPointComponent === null || previousPointEditorComponent === null) {
      render(this._pointListContainer, this._pointComponent);
      return;
    }


    if (this._pointListContainer.getElement().contains(previousPointComponent.getElement())) {
      replace(this._pointComponent, previousPointComponent);
    }

    if (this._pointListContainer.getElement().contains(previousPointEditorComponent.getElement())) {
      replace(this._pointComponent, previousPointEditorComponent);
    }

    remove(previousPointComponent);
    remove(previousPointEditorComponent);
  }


  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditorComponent);
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
  }


  _changeViewToEdit() {
    replace(this._pointEditorComponent, this._pointComponent);
    document.addEventListener('keydown', this._onEditorPointEscKeydown);
  }
}
