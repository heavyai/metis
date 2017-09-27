import {Chart} from "../../../packages/view-layer"

const toVega = vlSpec => vega.parse(vl.compile(vlSpec).spec);

const mergeSignals = view =>
  view.getState({
    signals: (signal, props) => {
      view._signals = Object.assign(view._signals, { [signal]: props });
    }
  });

export default class VegChart extends Chart {
  data = () => {
    return this.dataNode.values();
  }

  doRender = (data) => {
    this.state.data = { values: data };
    this.vegaView = new vega.View(toVega(this.state))
      .renderer("svg")
      .initialize(this.node)
      .run();
    mergeSignals(this.vegaView);
  }

  doRedraw = (data) => {
    this.vegaView.setState({ data: { source_0: data } });
  }
}
