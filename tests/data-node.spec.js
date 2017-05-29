// @flow
import tape from "tape";
import { createDataGraph } from "../index";

tape("Data Operator", t => {
  t.test("has api", q => {
    const graph = createDataGraph({ query: () => {} });
    const data = graph.data({
      name: "test",
      source: "table"
    });

    q.plan(3);
    q.equal(typeof data, "object");
    q.equal(typeof data.getState, "function");
    q.equal(typeof data.transform, "function");
  });

  t.test("transform method", q => {
    const graph = createDataGraph({ query: () => {} });
    const data = graph.data({
      name: "test",
      source: "table"
    });

    const transformArray = [
      { type: "filter", expr: "custom" },
      { type: "filter", expr: "custom" }
    ];

    data.transform(transformArray);

    q.plan(1);
    q.deepEqual(data.getState(), {
      name: "test",
      source: "table",
      transform: transformArray
    });
  });

  t.test("toSQL method", q => {
    const graph = createDataGraph({ query: () => {} });
    const data = graph.data({
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
        { type: "filter", expr: "amount > 1000" }
      ]
    });

    q.plan(1);
    q.equal(
      data.toSQL(),
      "SELECT * FROM contributions WHERE (recipient_party = 'D') AND (recipient_party = 'I') AND (amount > 1000)"
    );
  });
});
