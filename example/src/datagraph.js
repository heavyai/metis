import * as constants from "./constants";
import { createDataGraph } from "../../index";
import { query } from "./connector";

const graph = createDataGraph({ query });

export const xfilterDataNode = graph.data({
  source: "flights_donotmodify",
  name: "xfilter",
  transform: [
    {
      type: "crossfilter",
      signal: "vega",
      filter: []
    }
  ]
});

export const rowDataNode = graph.data({
  source: "xfilter",
  name: "row",
  transform: [
    {
      type: "aggregate",
      fields: ["dest_state"],
      groupby: ["dest_state"]
    },
    {
      type: "aggregate",
      fields: ["*"],
      ops: ["count"],
      as: ["records"]
    },
    {
      type: "collect",
      sort: {
        field: "records",
        order: "descending"
      }
    },
    {
      type: "collect",
      limit: {
        row: 20
      }
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: constants.ROW
    }
  ]
});

export const scatterDataNode = graph.data({
  source: "xfilter",
  name: "scatter",
  transform: [
    {
      type: "aggregate",
      fields: ["carrier_name"],
      as: ["key0"],
      groupby: "key0"
    },
    {
      type: "aggregate",
      fields: ["depdelay", "arrdelay", "*"],
      as: ["x", "y", "size"],
      ops: ["average", "average", "count"]
    },
    {
      type: "filter",
      expr: "depdelay IS NOT NULL"
    },
    {
      type: "filter",
      expr: "arrdelay IS NOT NULL"
    },
    {
      type: "collect",
      sort: {
        field: "size",
        order: "descending"
      }
    },
    {
      type: "collect",
      limit: {
        row: 15
      }
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: constants.SCATTER
    }
  ]
});

export default graph;
