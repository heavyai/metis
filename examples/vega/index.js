import Thrifty from "../../packages/thrift-layer"
import config from "../config"
import {createView} from "../../packages/view-layer"
import { createDataGraph } from "../../packages/data-layer";
import VegaChart from "./src/vega-chart"
import * as utils from "./src/utils"

import LINE_SPEC from "./specs/line"

const con = new Thrifty(config)
const graph = createDataGraph(con)
const view = createView()

const flightsData = graph.data("flights_donotmodify");
const xfilter = flightsData.data("xfilter");

const lineDispatch = view.dispatch()

function handleLineBrush () {
  this.vegaView.getState({
    data: (data, values) => {
      if (data === "filter_store") {
        const extent = utils.getExtent(values);
        if (extent) {
          console.log('sfsdf')
          lineDispatch.call("filter", this)
        }
      }
    }
  });
}

lineDispatch.on("setup.vega", function setup () {
  this.state = LINE_SPEC
  this.dataNode = xfilter.data({
    name: "line",
    transform: this.state.data.transform
  })
})

lineDispatch.on("postRender", function postRender() {
  this.vegaView.addSignalListener("filter_x", handleLineBrush.bind(this));
});

const barDispatxch = view.dispatch()

con.connect().then(() => {
  const lineChart = new VegaChart(document.getElementById("chart"), lineDispatch)
  console.log(lineChart)
  view.renderAll()
})
