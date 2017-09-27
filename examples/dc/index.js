import { Chart } from "../../packages/view-layer";
import { connector, view } from "./src/services";
import * as pie from "./src/pie";
import * as bar from "./src/stacked-bar";

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
  view.renderAll();
});
