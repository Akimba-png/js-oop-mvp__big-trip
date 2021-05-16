import FilterView from './../view/filter.js';
import {filter} from './../utils/filter.js';
import {remove, render, replace} from './../utils/render.js';
import {UpdateType, FilterType} from './../const.js';


export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);

    this._filterModel.addObserver(this._onModelEvent);
    this._pointsModel.addObserver(this._onModelEvent);
  }


  init(justFilterName) {
    const filterData = this._getFilterData(justFilterName);
    const previousFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filterData, this._filterModel.getActiveFilter());
    this._filterComponent.setFilterChangeListener(this._onFilterTypeChange);

    if (previousFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }
    replace(this._filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  }


  _getFilterData(justFilterName) {
    const points = justFilterName ? [] : this._pointsModel.getPoints();
    return [
      {
        type: FilterType.EVERYTHING,
        name: FilterType.EVERYTHING,
        amount: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: FilterType.FUTURE,
        amount: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        name: FilterType.PAST,
        amount: filter[FilterType.PAST](points).length,
      },
    ];
  }


  _onModelEvent() {
    this.init();
  }


  _onFilterTypeChange(filterType) {
    if (this._filterModel.getActiveFilter() === filterType) {
      return;
    }
    this._filterModel.setActiveFilter(UpdateType.MAJOR, filterType);
  }
}
