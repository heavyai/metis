// @flow
import tape from "tape";
import parseExpression from "../src/sql/parse-expression";

tape("parseExpression", assert => {
  assert.plan(13);

  assert.equal(parseExpression("AVG(depdelay)"), "AVG(depdelay)");

  assert.equal(
    parseExpression({
      type: "=",
      left: "amount",
      right: 100
    }),
    "amount = 100"
  );

  assert.equal(
    parseExpression({
      type: "=",
      left: "recipient_party",
      right: "D"
    }),
    "recipient_party = 'D'"
  );

  assert.equal(
    parseExpression({
      type: "not between",
      field: "amount",
      left: 50,
      right: 100
    }),
    "amount NOT BETWEEN 50 AND 100"
  );

  assert.equal(
    parseExpression({
      type: "is not null",
      field: "airtime"
    }),
    "airtime IS NOT NULL"
  );

  assert.equal(
    parseExpression({
      type: "ilike",
      left: "dest_city",
      right: "san"
    }),
    `dest_city ILIKE %"san"%`
  );

  assert.equal(
    parseExpression({
      type: "in",
      expr: "recipient_party",
      set: ["D", "R"]
    }),
    "recipient_party IN ('D', 'R')"
  );

  assert.equal(
    parseExpression({
      type: "coalesce",
      values: ["dest_city", "origin_city"]
    }),
    "COALESCE('dest_city', 'origin_city')"
  );

  assert.equal(
    parseExpression({
      type: "not",
      expr: {
        type: "=",
        left: "recipient_party",
        right: "D"
      }
    }),
    "NOT(recipient_party = 'D')"
  );

  assert.equal(
    parseExpression({
      type: "and",
      left: "recipient_party = 'D'",
      right: {
        type: "between",
        field: "amount",
        left: 50,
        right: 100
      }
    }),
    "(recipient_party = 'D' AND amount BETWEEN 50 AND 100)"
  );

  assert.equal(
    parseExpression({
      type: "case",
      cond: [
        [
          {
            type: "in",
            expr: "recipient_party",
            set: {
              type: "data",
              source: "contributions",
              name: "",
              transform: [
                {
                  type: "aggregate",
                  fields: ["recipient_party"],
                  groupby: "recipient_party"
                },
                {
                  type: "limit",
                  row: 10
                }
              ]
            }
          },
          "recipient_party"
        ]
      ],
      else: "other"
    }),
    "CASE WHEN recipient_party IN (SELECT recipient_party FROM contributions GROUP BY recipient_party LIMIT 10) THEN recipient_party ELSE 'other' END"
  );

  assert.equal(
    parseExpression({
      type: "extract",
      unit: "dow",
      field: "contrib_date"
    }),
    "extract(dow from contrib_date)"
  );

  assert.equal(
    parseExpression({
      type: "date_trunc",
      unit: "month",
      field: "contrib_date"
    }),
    "date_trunc(month, contrib_date)"
  );
});
