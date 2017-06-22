// @flow
import tape from "tape";
import { reduceNodes, nodePathToSQL } from "../src/node-path-utils";
import parser from "../src/sql/parser";

const child = {
  type: "data",
  source: "parent",
  name: "child",
  transform: [
    {
      type: "project",
      as: "key0",
      expr: "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0)))"
    },
    {
      type: "aggregate",
      groupby: ["key0"],
      fields: ["amount"],
      ops: ["average"],
      as: ["series_1"]
    }
  ]
};

const grandchild = {
  type: "data",
  source: "child",
  name: "grandchild",
  transform: [
    {
      type: "project",
      as: "key0",
      expr: "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0)))"
    },
    {
      type: "aggregate",
      groupby: ["key0"],
      fields: ["amount"],
      ops: ["average"],
      as: ["series_1"]
    }
  ]
};

const parent = {
  type: "data",
  source: [
    {
      type: "scan",
      table: "flights"
    }
  ],
  name: "parent",
  transform: [
    {
      type: "filter",
      id: "test",
      expr: "FILTER"
    }
  ]
};

const state = {
  parent,
  child,
  grandchild
};

const connector = {
  tables: [],
  query: () => Promise.resolve([])
};

const context = {
  state,
  connector,
  parser
};

tape("Reduce Nodes", t => {
  t.plan(3);

  t.deepEqual(reduceNodes(context, "grandchild"), {
    from: "flights",
    groupby: ["key0", "key0"],
    having: [],
    limit: "",
    offset: "",
    orderby: [],
    select: [
      "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0))) as key0",
      "AVG(amount) as series_1",
      "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0))) as key0",
      "AVG(amount) as series_1"
    ],
    unresolved: {},
    where: ["(FILTER)"]
  });

  t.deepEqual(reduceNodes(context, "child"), {
    from: "flights",
    groupby: ["key0"],
    having: [],
    limit: "",
    offset: "",
    orderby: [],
    select: [
      "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0))) as key0",
      "AVG(amount) as series_1"
    ],
    unresolved: {},
    where: ["(FILTER)"]
  });

  t.deepEqual(reduceNodes(context, "parent"), {
    select: [],
    from: "flights",
    where: ["(FILTER)"],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: "",
    unresolved: {}
  });
});
