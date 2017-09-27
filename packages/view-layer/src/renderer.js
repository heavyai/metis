// @flow
import type { ChartType, DispatchType } from "./chart";

const renderAsync = chart => chart.data().then(chart.render);
const redrawAsync = chart => chart.data().then(chart.redraw);

export default class Renderer {
  redrawing: boolean;
  debounced: boolean;

  constructor() {
    this.redrawing = false;
    this.debounced = false;
  }

  redrawAll = (
    charts: Array<ChartType<HTMLElement, DispatchType, string>>
  ): Promise<any> => {
    if (this.redrawing) {
      this.debounced = true;
      return Promise.resolve();
    } else {
      this.redrawing = true;
      return Promise.all(charts.map(redrawAsync)).then(() => {
        this.redrawing = false;
        if (this.debounced) {
          this.debounced = false;
          return Promise.all(charts.map(redrawAsync));
        }
      });
    }
  };

  renderAll(
    charts: Array<ChartType<HTMLElement, DispatchType, string>>
  ): Promise<any> {
    return Promise.all(charts.map(renderAsync));
  }
}
