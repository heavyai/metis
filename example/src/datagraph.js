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

/*
"SELECT date_trunc(month, dep_timestamp) as key0,
COUNT(*) AS series_1 FROM flights_donotmodify
WHERE (dep_timestamp >= TIMESTAMP(0) '1987-10-01 00:03:00' AND dep_timestamp <= TIMESTAMP(0) '2008-12-31 23:59:00')
GROUP BY key0 ORDER BY key0

*/

export const lineDataNode = graph.data({
  source: "xfilter",
  name: "line",
  transform: [
    {
      type: "formula",
      op: {
        type: "date_trunc",
        unit: "month",
        field: "dep_timestamp"
      },
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
      type: "collect",
      sort: {field: "x"}
    },
    {
      type: "filter",
      field: "dep_timestamp",
      range: [
        "TIMESTAMP(0) '1987-10-01 00:03:00'",
        "TIMESTAMP(0) '2008-12-31 23:59:00'"
      ]
    }
  ]
})

export default graph;
