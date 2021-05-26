import PointEditorView from './../view/point-editor.js';
import {render, remove, RenderPosition} from './../utils/render.js';
import {isEscEvent, isOnline} from './../utils/common.js';
import {UserAction, UpdateType, FlagMode} from './../const.js';
import {toast} from './../utils/toast.js';


export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._offers = null;
    this._destinations = null;

    this._pointEditorComponent = null;
    this._resumeNewButton = null;

    this._onEditorPointEscKeydown = this._onEditorPointEscKeydown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormDelete = this._onFormDelete.bind(this);
  }


  init(resumeNewButton, offers, destinations) {
    this._resumeNewButton = resumeNewButton;
    this._offers = offers;
    this._destinations = destinations;

    if (this._pointEditorComponent !== null) {
      return;
    }
    this._pointEditorComponent = new PointEditorView(this._offers, this._destinations);

    this._pointEditorComponent.setSubmitListener(this._onFormSubmit);
    this._pointEditorComponent.setDeleteListener(this._onFormDelete);

    render(this._pointListContainer, this._pointEditorComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._onEditorPointEscKeydown);
  }


  setSavingStatus() {
    this._pointEditorComponent.updateData(
      {
        isSaving: FlagMode.TRUE,
        isDisabled: FlagMode.TRUE,
      },
    );
  }


  setAbortingStatus() {
    const resetState = () => {
      this._pointEditorComponent.updateData({
        isSaving: FlagMode.FALSE,
        isDeleting: FlagMode.FALSE,
        isDisabled: FlagMode.FALSE,
      });
    };
    this._pointEditorComponent.shake(resetState);
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
    if (!isOnline()) {
      toast();
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }


  _onFormDelete() {
    this.destroy();
  }
}
