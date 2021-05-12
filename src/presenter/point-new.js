import PointEditorView from './../view/point-editor.js';
import {render, remove, RenderPosition} from './../utils/render.js';
import {isEscEvent} from './../utils/common.js';
import {UserAction, UpdateType} from './../const.js';
import {nanoid} from 'nanoid';


export default class PointNew {
  constructor(pointListContainer, changeData, offers) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._offers = offers;

    this._pointEditorComponent = null;
    this._resumeNewButton = null;

    this._onEditorPointEscKeydown = this._onEditorPointEscKeydown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormDelete = this._onFormDelete.bind(this);
  }


  init(callback) {
    this._resumeNewButton = callback;

    if (this._pointEditorComponent !== null) {
      return;
    }
    this._pointEditorComponent = new PointEditorView(this._offers);

    this._pointEditorComponent.setSubmitListener(this._onFormSubmit);
    this._pointEditorComponent.setDeleteListener(this._onFormDelete);

    render(this._pointListContainer, this._pointEditorComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._onEditorPointEscKeydown);
  }


  destroy() {
    if (this._pointEditorComponent === null) {
      return;
    }
    if (this._resumeNewButton !== null) {
      this._resumeNewButton();
    }
    remove(this._pointEditorComponent);
    this._pointEditorComponent = null;
    document.removeEventListener('keydown', this._onEditorPointEscKeydown);
  }


  _onEditorPointEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }


  _onFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, point),
    );
    this.destroy();
  }


  _onFormDelete() {
    this.destroy();
  }
}
