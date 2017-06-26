// @flow
import tape from "tape";
import * as expr from "../../src/helpers/expression-builders";
import {
  aggregate,
  filter,
  filterRange,
  filterIn,
  project,
  bin,
  limit,
  sort,
  top,
  bottom
} from "../../src/helpers/transform-builders";

const { alias } = expr;

tape("Expression Builders", assert => {
  assert.plan(12);

  assert.deepEqual(filter(expr.between("amount", [0, 100])), {
    type: "filter",
    expr: { field: "amount", left: 0, right: 100, type: "between" },
    id: ""
  });

  assert.deepEqual(filterRange("amount", [0, 100]), {
    type: "filter",
    id: "",
    expr: {
      type: "between",
      field: "amount",
      left: 0,
      right: 100
    }
  });

  assert.deepEqual(filterIn("state", ["MD", "FL", "CA"]), {
    type: "filter",
    id: "",
    expr: {
      type: "in",
      expr: "state",
      set: ["MD", "FL", "CA"]
    }
  });

  assert.deepEqual(project(alias("key1", expr.dateTrunc("month", "airtime"))), {
    type: "project",
    expr: {
      type: "date_trunc",
      unit: "month",
      field: "airtime"
    },
    as: "key1"
  });

  assert.deepEqual(
    aggregate(alias("key1", expr.dateTrunc("month", "airtime")), [
      expr.countStar("val"),
      expr.avg("color", "delay")
    ]),
    {
      type: "aggregate",
      fields: ["*", "delay"],
      ops: ["count", "average"],
      as: ["val", "color"],
      groupby: {
        type: "project",
        expr: {
          type: "date_trunc",
          unit: "month",
          field: "airtime"
        },
        as: "key1"
      }
    }
  );

  assert.deepEqual(
    aggregate(
      [
        alias("key1", expr.dateTrunc("month", "airtime")),
        alias("key2", expr.extract("year", "airtime"))
      ],
      [expr.countStar("val"), expr.avg("color", "delay")]
    ),
    {
      type: "aggregate",
      fields: ["*", "delay"],
      ops: ["count", "average"],
      as: ["val", "color"],
      groupby: [
        {
          type: "project",
          expr: {
            type: "date_trunc",
            unit: "month",
            field: "airtime"
          },
          as: "key1"
        },
        {
          type: "project",
          expr: {
            type: "extract",
            unit: "year",
            field: "airtime"
          },
          as: "key2"
        }
      ]
    }
  );

  assert.deepEqual(aggregate("recipient_party", expr.countStar("val")), {
    type: "aggregate",
    fields: ["*"],
    ops: ["count"],
    as: ["val"],
    groupby: "recipient_party"
  });

  assert.deepEqual(bin("key0", "amount", [0, 100], 12), {
    type: "bin",
    field: "amount",
    extent: [0, 100],
    maxbins: 12,
    as: "key0"
  });

  assert.deepEqual(limit(100, 10), {
    type: "limit",
    row: 100,
    offset: 10
  });

  assert.deepEqual(sort("amount", "descending"), {
    type: "sort",
    field: ["amount"],
    order: ["descending"]
  });

  assert.deepEqual(top("amount", 100, 2), [
    sort("amount", "descending"),
    limit(100, 2)
  ]);

  assert.deepEqual(bottom("amount", 100, 2), [
    sort("amount", "ascending"),
    limit(100, 2)
  ]);
});
