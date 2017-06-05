// @flow
import { createDataGraph } from "../../../index";
import { query } from "./connector";

export const graph = createDataGraph({
  query,
  tables: ["tweets_nov_feb"]
});

export const rootScan = graph.data({
  source: "tweets_nov_feb",
  name: "root",
  transform: []
});

export const minMaxNode = graph.data({
  source: "root",
  name: "minmax",
  transform: [
    {
      type: "aggregate",
      fields: ["tweet_time", "tweet_time"],
      ops: ["min", "max"],
      as: ["minimum", "maximum"]
    }
  ]
});

export const countDimensionNode = graph.data({
  source: "root",
  name: "count.dimension",
  transform: [
    {
      type: "formula",
      expr: "COUNT(*)",
      as: "records"
    }
  ]
});

export const crossfilter = graph.data({
  source: "root",
  name: "crossfilter",
  transform: []
});

export const countGroupNode = graph.data({
  source: "crossfilter",
  name: "count.group",
  transform: [
    {
      type: "formula",
      expr: "COUNT(*)",
      as: "records"
    },
    {
      type: "resolvefilter",
      filter: { signal: "mapd" },
      ignore: ""
    }
  ]
});

export const pointmapNode = graph.data({
  source: "crossfilter",
  name: "pointmap.group",
  transform: [
    {
      type: "formula",
      expr: "conv_4326_900913_x(lon)",
      as: "x"
    },
    {
      type: "formula",
      expr: "conv_4326_900913_y(lat)",
      as: "y"
    },
    {
      type: "formula",
      expr: "lang",
      as: "color"
    },
    {
      type: "formula",
      expr: "followers",
      as: "size"
    },
    {
      type: "formula",
      expr: "tweets_nov_feb.rowid"
    },
    {
      type: "collect.limit",
      limit: { row: 500000 }
    },
    {
      type: "sample",
      method: "multiplicative",
      size: 0,
      limit: 500000
    },
    {
      type: "resolvefilter",
      filter: { signal: "mapd" },
      ignore: ""
    }
  ]
});

export const timeDimensionNode = graph.data({
  source: "crossfilter",
  name: "line.dimension",
  transform: [
    {
      type: "aggregate",
      fields: ["*"],
      ops: ["count"],
      as: ["val"],
      groupby: {
        type: "formula.date_trunc",
        unit: "hour",
        field: "tweet_time",
        as: "key0"
      }
    },
    {
      type: "collect.sort",
      sort: { field: ["key0"] }
    }
  ]
});
