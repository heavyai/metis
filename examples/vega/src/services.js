import Thrifty from "../../../packages/thrift-layer";
import { createView } from "../../../packages/view-layer";
import { createDataGraph } from "../../../packages/data-layer";
import config from "../../config";

export const view = createView();
export const connector = new Thrifty(config);
export const dataGraph = createDataGraph(connector);
export const flightsDataGraph = dataGraph.data("flights_donotmodify");
export const xfilterNode = flightsDataGraph.data({
  name: "xfilter",
  transform: [
    {
      type: "crossfilter",
      signal: "XFILTER",
      filter: {}
    }
  ]
});
