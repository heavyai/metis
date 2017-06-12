// @flow
import tape from "tape";
import { createDataGraph } from "../index";

tape("Data Operator", t => {
  t.test("has api", q => {
    const graph = createDataGraph({
      query: () => Promise.resolve([]),
      tables: []
    });
    const data = graph.data({
      type: "data",
      name: "test",
      source: "table",
      transform: []
    });

    q.plan(3);
    q.equal(typeof data, "object");
    q.equal(typeof data.getState, "function");
    q.equal(typeof data.transform, "function");
  });

  t.test("transform method", q => {
    const graph = createDataGraph({
      query: () => Promise.resolve([]),
      tables: []
    });
    const data = graph.data({
      type: "data",
      name: "test",
      source: "table",
      transform: []
    });

    q.plan(2);

    const transformArray = [
      { type: "filter", id: "test", expr: "custom" },
      { type: "filter", id: "test", expr: "custom" }
    ];

    data.transform(transformArray);

    q.deepEqual(data.getState(), {
      type: "data",
      name: "test",
      source: "table",
      transform: transformArray
    });

    data.transform(transform =>
      transform.map(t =>
        Object.assign({}, t, {
          expr: "test"
        })
      )
    );

    q.deepEqual(data.getState(), {
      type: "data",
      name: "test",
      source: "table",
      transform: [
        { type: "filter", id: "test", expr: "test" },
        { type: "filter", id: "test", expr: "test" }
      ]
    });
  });

  t.test("toSQL method", q => {
    const graph = createDataGraph({
      query: () => Promise.resolve([]),
      tables: []
    });
    const data = graph.data({
      type: "data",
      name: "test",
      source: "contributions",
      transform: [
        {
          type: "crossfilter",
          signal: "group",
          filter: [
            {
              type: "filter",
              id: "pie",
              expr: "recipient_party = 'D'"
            },
            {
              type: "filter",
              id: "row",
              expr: "recipient_party = 'R'"
            },
            {
              type: "filter",
              id: "bubble",
              expr: "recipient_party = 'I'"
            }
          ]
        },
        {
          type: "resolvefilter",
          filter: { signal: "group" },
          ignore: ["row"]
        },
        { type: "filter", id: "test", expr: "amount > 1000" }
      ]
    });

    q.plan(1);
    q.equal(
      data.toSQL(),
      "SELECT * FROM contributions WHERE (recipient_party = 'D') AND (recipient_party = 'I') AND (amount > 1000)"
    );
  });

  t.test("values method", assert => {
    const graph = createDataGraph({
      query: query => {
        // $FlowFixMe
        return Promise.resolve(query);
      },
      tables: []
    });

    const child = graph.data({
      type: "data",
      source: "flights",
      name: "parallel",
      transform: [
        {
          type: "aggregate",
          fields: ["dest_city"],
          as: ["name"],

          groupby: "name"
        },
        {
          type: "aggregate",
          fields: ["*"],
          ops: ["count"],
          as: ["a"]
        }
      ]
    });

    assert.plan(1);
    child.values().then(query => {
      assert.equal(
        query,
        "SELECT dest_city as name, COUNT(*) as a FROM flights GROUP BY name"
      );
    });
  });
});

tape("Crossfiltering Graph", assert => {
  const graph = createDataGraph({
    query: () => Promise.resolve([]),
    tables: ["flights_donotmodify"]
  });

  const xfilterDataNode = graph.data({
    type: "data",
    source: "flights_donotmodify",
    name: "xfilter",
    transform: [
      {
        type: "crossfilter",
        signal: "vega",
        filter: [
          {
            type: "filter",
            id: "row",
            expr: "carrier_name = 'R'"
          },
          {
            type: "filter",
            id: "pie",
            expr: "carrier_name = 'D'"
          }
        ]
      }
    ]
  });

  const rowDataNode = graph.data({
    type: "data",
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
        type: "sort",
        field: ["records"],
        order: ["descending"]
      },
      {
        type: "limit",
        row: 12
      },
      {
        type: "resolvefilter",
        filter: { signal: "vega" },
        ignore: "row"
      }
    ]
  });

  const lineDataNode = graph.data({
    type: "data",
    source: "xfilter",
    name: "line",
    transform: [
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["y"],
        groupby: {
          type: "project",
          expr: {
            type: "date_trunc",
            unit: "day",
            field: "dep_timestamp"
          },
          as: "x"
        }
      },
      {
        type: "sort",
        field: ["x"]
      },
      {
        type: "filter",
        id: "test",
        expr: {
          type: "between",
          field: "dep_timestamp",
          left: "TIMESTAMP(0) '1987-10-01 00:03:00'",
          right: "TIMESTAMP(0) '2008-12-31 23:59:00'"
        }
      }
    ]
  });

  assert.plan(2);
  assert.equal(
    rowDataNode.toSQL(),
    "SELECT dest_state, COUNT(*) as records FROM flights_donotmodify WHERE (carrier_name = 'D') GROUP BY dest_state ORDER BY records DESC LIMIT 12"
  );
  assert.equal(
    lineDataNode.toSQL(),
    "SELECT COUNT(*) as y, date_trunc(day, dep_timestamp) as x FROM flights_donotmodify WHERE (dep_timestamp BETWEEN TIMESTAMP(0) '1987-10-01 00:03:00' AND TIMESTAMP(0) '2008-12-31 23:59:00') GROUP BY x ORDER BY x"
  );
});
