import Thrifty from "../../../packages/thrift-layer";
import { createView } from "../../../packages/view-layer";
import { createDataGraph } from "../../../packages/data-layer";
import config from "../../config";

export const view = createView();
export const connector = new Thrifty(config);
const dataGraph = createDataGraph(connector);
const flightsDataGraph = dataGraph.data("tweets_nov_feb");
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
