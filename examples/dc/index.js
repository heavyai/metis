import { Chart } from "../../packages/view-layer/src";
import { connector, view } from "./src/services";
import * as pie from "./src/pie";
import * as bar from "./src/stacked-bar";
import * as count from "./src/count"

class DCChart extends Chart {
  data = () => {
    return this.dataNode.values();
  };
  doRender = () => {
    this.chart.render();
  };
  doRedraw = () => {
    this.chart.redraw();
  };
}

connector.connect().then(() => {
  const pieChart = new DCChart(document.getElementById("chart"), pie.dispatch);
  const barChart = new DCChart(document.getElementById("chart"), bar.dispatch);
  const countChart = new DCChart(document.getElementById("chart"), count.dispatch);
  view.renderAll();
});
