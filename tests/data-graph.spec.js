// @flow
import tape from "tape";
import { createDataGraph } from "../index";

tape("Data Graph API", function(t) {
  t.test("Graph object", function(q) {
    q.plan(3);

    const graph = createDataGraph({ query: () => {} });

    q.equal(typeof graph, "object", "should be object");
    q.equal(typeof graph.getState, "function", "should have getState method");
    q.equal(typeof graph.data, "function", "should have createDataNode method");
  });

  t.test("Data Method", q => {
    q.plan(1);

    try {
      const graph = createDataGraph();
      graph.data();
    } catch (e) {
      q.ok(true, "should throw error when state is not passed in");
    }
  });
});

tape("Data Graph Integration Tests", assert => {
  assert.plan(12);
  const graph = createDataGraph({ query: () => {} });

  const globalFilterNode = graph.data({ source: "flights", name: "global" });
  const xFilterNode = graph.data({ source: "global", name: "xfilter" });

  const chartNode1 = graph.data({
    source: "xfilter",
    name: "1",
    transform: [
      {
        type: "aggregate",
        fields: ["payment_type"],
        as: ["key0"],
        groupby: ["key0"]
      },
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["val"]
      },
      {
        type: "collect.sort",
        sort: { field: ["val"], order: ["ascending"] }
      },
      {
        type: "collect.limit",
        limit: { row: 10 }
      }
    ]
  });

  const chartNode2 = graph.data({
    source: "xfilter",
    name: "2",
    transform: [
      {
        type: "bin",
        field: "trip_distance",
        extent: [0, 30],
        maxbins: 30,
        as: "key0"
      },
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["val"]
      }
    ]
  });

  assert.equal(graph.nodes().length, 4);

  assert.equal(
    globalFilterNode.toSQL(),
    "SELECT * FROM flights",
    "globalFilterNode state should be initialized correctly"
  );

  assert.equal(
    xFilterNode.toSQL(),
    "SELECT * FROM flights",
    "xFilterNode state should be initialized correctly"
  );

  assert.equal(
    chartNode1.toSQL(),
    "SELECT payment_type as key0, COUNT(*) as val FROM flights GROUP BY key0 ORDER BY val ASC LIMIT 10",
    "chartNode1 state should be initialized correctly"
  );

  assert.equal(
    chartNode2.toSQL(),
    "SELECT cast((cast(trip_distance as float) - 0) * 1 as int) as key0, COUNT(*) as val FROM flights WHERE ((trip_distance >= 0 AND trip_distance <= 30) OR (trip_distance IS NULL)) GROUP BY key0 HAVING (key0 >= 0 AND key0 < 30 OR key0 IS NULL)",
    "chartNode2 state should be initialized correctly"
  );

  globalFilterNode.transform({
    type: "filter.range",
    field: "dropoff_longitude",
    range: [-73.99828105055514, -73.7766089742046]
  });

  globalFilterNode.transform({
    type: "filter.range",
    field: "dropoff_latitude",
    range: [40.63646686110235, 40.81468768513369]
  });

  assert.equal(
    globalFilterNode.toSQL(),
    "SELECT * FROM flights WHERE (dropoff_longitude >= -73.99828105055514 AND dropoff_longitude <= -73.7766089742046) AND (dropoff_latitude >= 40.63646686110235 AND dropoff_latitude <= 40.81468768513369)",
    "globalFilterNode SQL should include added filter transforms"
  );

  xFilterNode.transform({
    type: "crossfilter",
    signal: "group",
    filter: [
      {
        type: "filter.exact",
        id: "row",
        field: "payment_type",
        equals: "cash"
      },
      {
        type: "filter.range",
        id: "histogram",
        field: "trip_distance",
        range: [12, 20]
      }
    ]
  });

  chartNode1.transform({
    type: "resolvefilter",
    filter: { signal: "group" },
    ignore: "row"
  });

  chartNode2.transform({
    type: "resolvefilter",
    filter: { signal: "group" },
    ignore: "histogram"
  });

  assert.equal(
    chartNode1.toSQL(),
    "SELECT payment_type as key0, COUNT(*) as val FROM flights WHERE (trip_distance >= 12 AND trip_distance <= 20) AND (dropoff_longitude >= -73.99828105055514 AND dropoff_longitude <= -73.7766089742046) AND (dropoff_latitude >= 40.63646686110235 AND dropoff_latitude <= 40.81468768513369) GROUP BY key0 ORDER BY val ASC LIMIT 10",
    "chartNode1 SQL should resolve the proper crossfilters"
  );

  assert.equal(
    chartNode2.toSQL(),
    "SELECT cast((cast(trip_distance as float) - 0) * 1 as int) as key0, COUNT(*) as val FROM flights WHERE ((trip_distance >= 0 AND trip_distance <= 30) OR (trip_distance IS NULL)) AND (payment_type = 'cash') AND (dropoff_longitude >= -73.99828105055514 AND dropoff_longitude <= -73.7766089742046) AND (dropoff_latitude >= 40.63646686110235 AND dropoff_latitude <= 40.81468768513369) GROUP BY key0 HAVING (key0 >= 0 AND key0 < 30 OR key0 IS NULL)",
    "chartNode2 SQL should resolve the proper crossfilters"
  );

  const state = graph.getState();
  assert.deepEqual(
    state[1],
    chartNode1.getState(),
    "chartNode1 state should equal the corresponding graph state slice"
  );
  assert.deepEqual(
    state[2],
    chartNode2.getState(),
    "chartNode2 state should equal the corresponding graph state slice"
  );
  assert.deepEqual(
    state["global"],
    globalFilterNode.getState(),
    "globalFilterNode state should equal the corresponding graph state slice"
  );
  assert.deepEqual(
    state["xfilter"],
    xFilterNode.getState(),
    "xFilterNode state should equal the corresponding graph state slice"
  );
});
