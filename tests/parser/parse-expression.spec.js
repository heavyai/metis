// @flow
import tape from "tape";
import parseExpression from "../../src/parser/parse-expression";

tape("parseExpression", assert => {
  assert.plan(20);

  assert.equal(parseExpression("AVG(depdelay)"), "AVG(depdelay)");

  assert.equal(
    parseExpression({
      type: "stddev",
      x: "amount"
    }),
    "stddev(amount)"
  );

  assert.equal(
    parseExpression({
      type: "max",
      field: "amount"
    }),
    "max(amount)"
  );

  assert.equal(
    parseExpression({
      type: "count",
      distinct: true,
      approx: true,
      field: "*"
    }),
    "approx_count_distinct(*)"
  );

  assert.equal(
    parseExpression({
      type: "count",
      distinct: true,
      approx: false,
      field: "*"
    }),
    "count(distinct * )"
  );

  assert.equal(
    parseExpression({
      type: "count",
      distinct: false,
      approx: false,
      field: "*"
    }),
    "count(*)"
  );

  assert.equal(
    parseExpression({
      type: "stddev",
      x: "amount"
    }),
    "stddev(amount)"
  );

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
              type: "root",
              source: "contributions",
              name: "",
              transform: [
                {
                  type: "aggregate",
                  fields: ["amount"],
                  ops: ["max"],
                  as: ["val"],
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
    "CASE WHEN recipient_party IN (SELECT recipient_party, MAX(amount) as val FROM contributions GROUP BY recipient_party LIMIT 10) THEN recipient_party ELSE 'other' END"
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

  assert.equal(
    parseExpression({
      type: "root",
      name: "test",
      source: "taxis",
      children: [],
      transform: [
        {
          type: "aggregate",
          fields: ["*"],
          ops: ["count"],
          as: ["series_1"],
          groupby: {
            type: "bin",
            field: "total_amount",
            extent: [-21474830, 3950611.6],
            maxbins: 12,
            as: "key0"
          }
        }
      ]
    }),
    "(SELECT cast((cast(total_amount as float) - -21474830) * 4.719682036909046e-7 as int) as key0, COUNT(*) as series_1 FROM taxis WHERE ((total_amount >= -21474830 AND total_amount <= 3950611.6) OR (total_amount IS NULL)) GROUP BY key0 HAVING (key0 >= 0 AND key0 < 12 OR key0 IS NULL))"
  );
});
