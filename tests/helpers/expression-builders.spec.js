// @flow
import tape from "tape";
import * as helpers from "../../src/helpers/expression-builders";

tape("Expression Builders", assert => {
  assert.plan(10);
  assert.deepEqual(
    helpers.caseExpr(
      [
        [helpers.inExpr("state", ["CA", "OR", "WA"]), "west"],
        [helpers.inExpr("state", ["MD", "NY", "PA"]), "east"]
      ],
      "other"
    ),
    {
      type: "case",
      cond: [
        [{ expr: "state", set: ["CA", "OR", "WA"], type: "in" }, "west"],
        [{ expr: "state", set: ["MD", "NY", "PA"], type: "in" }, "east"]
      ],
      else: "other"
    }
  );

  assert.deepEqual(helpers.extract("dow", "date"), {
    type: "extract",
    unit: "dow",
    field: "date"
  });
  assert.deepEqual(helpers.min("val", "amount"), {
    type: "min",
    field: "amount",
    as: "val"
  });
  assert.deepEqual(helpers.max("val", "amount"), {
    type: "max",
    field: "amount",
    as: "val"
  });
  assert.deepEqual(helpers.sum("val", "amount"), {
    type: "sum",
    field: "amount",
    as: "val"
  });
  assert.deepEqual(helpers.avg("val", "amount"), {
    type: "average",
    field: "amount",
    as: "val"
  });
  assert.deepEqual(helpers.count(true, "val", "amount"), {
    type: "count",
    distinct: true,
    approx: false,
    field: "amount",
    as: "val"
  });
  assert.deepEqual(helpers.approxCount(true, "val", "amount"), {
    type: "count",
    distinct: true,
    approx: true,
    field: "amount",
    as: "val"
  });
  assert.deepEqual(helpers.countStar("val"), {
    type: "count",
    distinct: false,
    approx: false,
    field: "*",
    as: "val"
  });
  assert.deepEqual(
    helpers.not(helpers.inExpr("recipient_party", ["R", "R", "I"])),
    {
      type: "not",
      expr: {
        type: "in",
        expr: "recipient_party",
        set: ["R", "R", "I"]
      }
    }
  );
});
