// @flow
import type {ChartType} from "./chart"

let redrawing = false;
let debounced = false;

const renderAsync = chart => chart.data().then(chart.render);
const redrawAsync = chart => chart.data().then(chart.redraw);

export function redrawAll(charts: Array<ChartType<string | number, HTMLElement>>): Promise<any> {
  if (redrawing) {
    debounced = true;
    return Promise.resolve();
  } else {
    redrawing = true;
    return Promise.all(charts.map(redrawAsync)).then(() => {
      redrawing = false;
      if (debounced) {
        debounced = false;
        return Promise.all(charts.map(redrawAsync));
      }
    });
  }
}

export function renderAll(charts: Array<ChartType<string | number, HTMLElement>>): Promise<any> {
  return Promise.all(charts.map(renderAsync));
}
