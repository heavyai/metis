import tape from "tape"
import {writeSQL} from "../src"

tape("writeSQL", assert => {
  assert.plan(5)

  assert.equal(writeSQL({
    source: "flights",
    transform: [],
  }), "SELECT * FROM flights")

  assert.equal(writeSQL({
    source: "flights",
    transform: [
      {
        type: "aggregate",
        fields: ["dest_city"]
      },
      {
        type: "aggregate",
        groupby: ["dest_city"],
        fields: ["depdelay"],
        ops: ["average"],
        as: ["val"]
      }
  ],
  }), "SELECT dest_city, AVG(depdelay) as val FROM flights GROUP BY dest_city")

  assert.equal(writeSQL({
    source: "contributions",
    transform: [{
      type: "filter",
      expr: "recipient_party = R OR recipient_party = D"
    }],
  }), "SELECT * FROM contributions WHERE (recipient_party = R OR recipient_party = D)")

  assert.equal(writeSQL({
    source: "flights",
    transform: [
      {
        type: "formula",
        as: "key0",
        expr: "airtime"
      },
      {
        type: "aggregate",
        groupby: ["key0"],
        fields: ["*", "*"],
        ops: ["count", "count"],
        as: ["color", "val"]
      },
      {
        type: "bin",
        field: "key0",
        extent: [0, 1350],
        maxbins: 12
      }
    ]
  }), "SELECT airtime as key0, COUNT(*) AS val, COUNT(*) AS color FROM flights_donotmodify WHERE ((airtime >= 0 AND airtime <= 1350) OR (airtime IS NULL)) GROUP BY key0 HAVING (key0 >= 0 AND key0 < 12 OR key0 IS NULL)")

    assert.equal(writeSQL({
      source: "contributions",
      transform: [
        {
          "type": "formula",
          "op": {
            "type": "date_trunc",
            "unit": "year",
            "field": "CAST(contrib_date AS TIMESTAMP(0))",
          },
          "as": "key0"
        },
        {
          "type": "aggregate",
          "groupby": ["key0"],
          "fields": ["amount"],
          "ops": ["average"],
          "as": ["series_1"]
        },
        {
          "type": "collect",
          "sort": { "field": "key0" }
        },
        {
          "type": "filter",
          "field": "CAST(contrib_date AS TIMESTAMP(0)))",
          "range": ["1996-11-05 17:47:30", "2010-10-21 10:54:07"]
        },
        {
          "type": "filter",
          "expr": "amount IS NOT NULL"
        }
      ]
    }), "SELECT date_trunc(year, CAST(contrib_date AS TIMESTAMP(0))) as key0, AVG(amount) AS series_1 FROM contributions WHERE (CAST(contrib_date AS TIMESTAMP(0)) >= TIMESTAMP(0) '1996-11-05 17:47:30' AND CAST(contrib_date AS TIMESTAMP(0)) <= TIMESTAMP(0) '2010-10-21 10:54:07') AND amount IS NOT NULL GROUP BY key0 ORDER BY key0")

})
