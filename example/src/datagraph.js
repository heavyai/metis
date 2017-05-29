// @flow
import * as constants from "./constants";
import { createDataGraph } from "../../src/data-graph";
import { query } from "./connector";

const graph = createDataGraph({ query, tables: ["flights_donotmodify"] });

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
      type: "collect.sort",
      sort: {
        field: ["records"],
        order: ["descending"]
      }
    },
    {
      type: "collect.limit",
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
      id: "test",
      expr: "depdelay IS NOT NULL"
    },
    {
      type: "filter",
      id: "test",
      expr: "arrdelay IS NOT NULL"
    },
    {
      type: "collect.sort",
      sort: {
        field: ["size"],
        order: ["descending"]
      }
    },
    {
      type: "collect.limit",
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

export const lineDataNode = graph.data({
  source: "xfilter",
  name: "line",
  transform: [
    {
      type: "formula.date_trunc",
      unit: "month",
      field: "dep_timestamp",
      as: "x"
    },
    {
      type: "aggregate",
      fields: ["*"],
      ops: ["count"],
      as: ["y"],
      groupby: "x"
    },
    {
      type: "collect.sort",
      sort: { field: ["x"] }
    },
    {
      type: "filter.range",
      id: "test",
      field: "dep_timestamp",
      range: [
        "TIMESTAMP(0) '1987-10-01 00:03:00'",
        "TIMESTAMP(0) '2008-12-31 23:59:00'"
      ]
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: constants.LINE
    }
  ]
});

export default graph;
