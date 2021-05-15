import AbstractView from './abstract.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUniqueTypes, getSortedData} from './../utils/statistics.js';
import {humanizeDateDuration} from './../utils/point.js';
import {FlagMode} from './../const.js';

const BAR_HEIGHT = 55;
const HEIGHT_MULTIPLIER = 5;
const CHART_TYPE = 'horizontalBar';

const ChartMode = {
  MONEY: 'money',
  TYPE: 'type',
  TIME: 'time',
};

const Colors = {
  BACKGROUND: '#ffffff',
  FONT: '#000000',
};

const ScaleName = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME_SPEND: 'TIME-SPEND',
};

const Position = {
  START: 'start',
  END: 'end',
  LEFT: 'left',
};

const ChartPropertie = {
  FontSize: {
    LABEL: 13,
    TITLE: 23,
    TICK: 13,
  },
  BAR_WEIGHT: 44,
  MIN_BAR_LENGTH: 120,
  TICK_PADDING: 5,
};


const renderMoneyChart = (moneyCtx, points, types) => {
  const moneyData = getSortedData(points, types, ChartMode.MONEY);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: CHART_TYPE,
    data: {
      labels: moneyData.types,
      datasets: [{
        data: moneyData.values,
        backgroundColor: Colors.BACKGROUND,
        hoverBackgroundColor: Colors.BACKGROUND,
        anchor: Position.START,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartPropertie.FontSize.LABEL,
          },
          color: Colors.FONT,
          anchor: Position.END,
          align: Position.START,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: FlagMode.TRUE,
        text: ScaleName.MONEY,
        fontColor: Colors.FONT,
        fontSize: ChartPropertie.FontSize.TITLE,
        position: Position.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Colors.FONT,
            padding: ChartPropertie.TICK_PADDING,
            fontSize: ChartPropertie.FontSize.TICK,
          },
          gridLines: {
            display: FlagMode.FALSE,
            drawBorder: FlagMode.FALSE,
          },
          barThickness: ChartPropertie.BAR_WEIGHT,
        }],
        xAxes: [{
          ticks: {
            display: FlagMode.FALSE,
            beginAtZero: FlagMode.TRUE,
          },
          gridLines: {
            display: FlagMode.FALSE,
            drawBorder: FlagMode.FALSE,
          },
          minBarLength: ChartPropertie.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: FlagMode.FALSE,
      },
      tooltips: {
        enabled: FlagMode.FALSE,
      },
    },
  });
};


const renderTypeChart = (typeCtx, points, types) => {
  const typeData = getSortedData(points, types, ChartMode.TYPE);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: CHART_TYPE,
    data: {
      labels: typeData.types,
      datasets: [{
        data: typeData.values,
        backgroundColor: Colors.BACKGROUND,
        hoverBackgroundColor: Colors.BACKGROUND,
        anchor: Position.START,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartPropertie.FontSize.LABEL,
          },
          color: Colors.FONT,
          anchor: Position.END,
          align: Position.START,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: FlagMode.TRUE,
        text: ScaleName.TYPE,
        fontColor: Colors.FONT,
        fontSize: ChartPropertie.FontSize.TITLE,
        position: Position.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Colors.FONT,
            padding: ChartPropertie.TICK_PADDING,
            fontSize: ChartPropertie.FontSize.TICK,
          },
          gridLines: {
            display: FlagMode.FALSE,
            drawBorder: FlagMode.FALSE,
          },
          barThickness: ChartPropertie.BAR_WEIGHT,
        }],
        xAxes: [{
          ticks: {
            display: FlagMode.FALSE,
            beginAtZero: FlagMode.TRUE,
          },
          gridLines: {
            display: FlagMode.FALSE,
            drawBorder: FlagMode.FALSE,
          },
          minBarLength: ChartPropertie.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: FlagMode.FALSE,
      },
      tooltips: {
        enabled: FlagMode.FALSE,
      },
    },
  });

};


const rendetTimeChart = (timeCtx, points, types) => {
  const timeData = getSortedData(points, types, ChartMode.TIME);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: CHART_TYPE,
    data: {
      labels: timeData.types,
      datasets: [{
        data: timeData.values,
        backgroundColor: Colors.BACKGROUND,
        hoverBackgroundColor: Colors.BACKGROUND,
        anchor: Position.START,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartPropertie.FontSize.LABEL,
          },
          color: Colors.FONT,
          anchor: Position.END,
          align: Position.START,
          formatter: (val) => `${humanizeDateDuration(val)}`,
        },
      },
      title: {
        display: FlagMode.TRUE,
        text: ScaleName.TIME_SPEND,
        fontColor: Colors.FONT,
        fontSize: ChartPropertie.FontSize.TITLE,
        position: Position.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Colors.FONT,
            padding: ChartPropertie.TICK_PADDING,
            fontSize: ChartPropertie.FontSize.TICK,
          },
          gridLines: {
            display: FlagMode.FALSE,
            drawBorder: FlagMode.FALSE,
          },
          barThickness: ChartPropertie.BAR_WEIGHT,
        }],
        xAxes: [{
          ticks: {
            display: FlagMode.FALSE,
            beginAtZero: FlagMode.TRUE,
          },
          gridLines: {
            display: FlagMode.FALSE,
            drawBorder: FlagMode.FALSE,
          },
          minBarLength: ChartPropertie.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: FlagMode.FALSE,
      },
      tooltips: {
        enabled: FlagMode.FALSE,
      },
    },
  });
};


const createStatisticsTemplate = () => {
  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};


export default class Statistics extends AbstractView {
  constructor(points) {
    super();
    this._pointsData = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }


  getTemplate() {
    return createStatisticsTemplate(this._pointsData);
  }


  _resetCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }


  removeElement() {
    super.removeElement();
    this._resetCharts();
  }


  _setCharts() {
    this._resetCharts();
    const uniqueTypes = getUniqueTypes(this._pointsData);
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = renderMoneyChart(moneyCtx, this._pointsData, uniqueTypes);
    this._typeChart = renderTypeChart(typeCtx, this._pointsData, uniqueTypes);
    this._timeChart = rendetTimeChart(timeCtx, this._pointsData, uniqueTypes);

    moneyCtx.height = BAR_HEIGHT * HEIGHT_MULTIPLIER;
    typeCtx.height = BAR_HEIGHT * HEIGHT_MULTIPLIER;
    timeCtx.height = BAR_HEIGHT * HEIGHT_MULTIPLIER;
  }
}
