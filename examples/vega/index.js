import { Chart } from "../../packages/view-layer";
import { view, connector } from "./src/services";
import * as line from "./src/charts/line";
import * as bar from "./src/charts/bar";
import * as utils from "./src/utils";

class VegaChart extends Chart {
  data = () => {
    return this.dataNode.values();
  };

  doRender = data => {
    this.state.data = { values: data };
    this.vegaView = new vega.View(utils.toVega(this.state))
      .renderer("svg")
      .initialize(this.node)
      .run();
    utils.mergeSignals(this.vegaView);
  };

  doRedraw = data => {
    this.vegaView.setState({ data: { source_0: data } });
  };
}

connector.connect().then(() => {
  const lineChart = new VegaChart(
    document.getElementById("chart"),
    line.dispatch
  );
  const barChart = new VegaChart(
    document.getElementById("chart2"),
    bar.dispatch
  );
  view.renderAll();
});
