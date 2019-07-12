// @flow
import tape from "tape";
import createDataGraph from "../src/create-data-graph";
import { filterRange } from "../src/helpers/transform-builders";

function concat(transform) {
  return transforms => transforms.concat(transform);
}

tape("Integration Test", assert => {
  assert.plan(7);

  const graph = createDataGraph({
    query: () => Promise.resolve([]),
    tables: []
  });

  const globalFilterNode = graph.data({
    source: "flights",
    name: "global"
  });

  const xFilterNode = globalFilterNode.data({
    name: "xfilter"
  });

  const chartNode1 = xFilterNode.data({
    name: "1",
    transform: [
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["val"],
        groupby: {
          type: "project",
          expr: "payment_type",
          as: "key0"
        }
      },
      {
        type: "sort",
        field: ["val"],
        order: ["ascending"]
      },
      {
        type: "limit",
        row: 10
      }
    ]
  });

  const chartNode2 = xFilterNode.data({
    name: "2",
    transform: [
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["val"],
        groupby: {
          type: "bin",
          field: "trip_distance",
          extent: [0, 30],
          maxbins: 30,
          as: "key0"
        }
      }
    ]
  });

  assert.equal(globalFilterNode.toSQL(), "SELECT * FROM flights");

  assert.equal(xFilterNode.toSQL(), "SELECT * FROM flights");

  assert.equal(
    chartNode1.toSQL(),
    "SELECT payment_type AS key0, COUNT(*) AS val FROM flights GROUP BY key0 ORDER BY val ASC LIMIT 10"
  );

  assert.equal(
    chartNode2.toSQL(),
    "SELECT case when\n      trip_distance >= 30\n    then\n      29\n    else\n      cast((cast(trip_distance as float) - 0) * 1 as int)\n    end\n    AS key0, COUNT(*) AS val FROM flights WHERE ((trip_distance >= 0 AND trip_distance <= 30) OR (trip_distance IS NULL)) GROUP BY key0 HAVING (key0 >= 0 AND key0 < 30 OR key0 IS NULL)"
  );

  globalFilterNode.transform(
    concat({
      type: "filter",
      id: "test",
      expr: {
        type: "between",
        field: "dropoff_longitude",
        left: -73.99828105055514,
        right: -73.7766089742046
      }
    })
  );

  globalFilterNode.transform(
    concat(
      filterRange(
        "dropoff_latitude",
        [40.63646686110235, 40.81468768513369],
        "test"
      )
    )
  );

  assert.equal(
    globalFilterNode.toSQL(),
    "SELECT * FROM flights WHERE (dropoff_longitude BETWEEN -73.99828105055514 AND -73.7766089742046) AND (dropoff_latitude BETWEEN 40.63646686110235 AND 40.81468768513369)"
  );

  xFilterNode.transform(
    concat({
      type: "crossfilter",
      signal: "group",
      filter: {
        row: {
          type: "filter",
          id: "row",
          expr: {
            type: "=",
            left: "payment_type",
            right: "cash"
          }
        },
        histogram: {
          type: "filter",
          id: "histogram",
          expr: {
            type: "between",
            field: "trip_distance",
            left: 12,
            right: 20
          }
        }
      }
    })
  );

  chartNode1.transform(
    concat({
      type: "resolvefilter",
      filter: { signal: "group" },
      ignore: "row"
    })
  );

  chartNode2.transform(
    concat({
      type: "resolvefilter",
      filter: { signal: "group" },
      ignore: "histogram"
    })
  );

  assert.equal(
    chartNode1.toSQL(),
    "SELECT payment_type AS key0, COUNT(*) AS val FROM flights WHERE (trip_distance BETWEEN 12 AND 20) AND (dropoff_longitude BETWEEN -73.99828105055514 AND -73.7766089742046) AND (dropoff_latitude BETWEEN 40.63646686110235 AND 40.81468768513369) GROUP BY key0 ORDER BY val ASC LIMIT 10"
  );

  assert.equal(
    chartNode2.toSQL(),
    "SELECT case when\n      trip_distance >= 30\n    then\n      29\n    else\n      cast((cast(trip_distance as float) - 0) * 1 as int)\n    end\n    AS key0, COUNT(*) AS val FROM flights WHERE ((trip_distance >= 0 AND trip_distance <= 30) OR (trip_distance IS NULL)) AND (payment_type = \'cash\') AND (dropoff_longitude BETWEEN -73.99828105055514 AND -73.7766089742046) AND (dropoff_latitude BETWEEN 40.63646686110235 AND 40.81468768513369) GROUP BY key0 HAVING (key0 >= 0 AND key0 < 30 OR key0 IS NULL)"
  );
});
