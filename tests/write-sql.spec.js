import tape from "tape"
import {writeSQL} from "../src"

tape("writeSQL", assert => {
  assert.plan(1)

  assert.equal(writeSQL({
    source: "flights",
    transform: [],
  }), "SELECT * FROM flights")

})


// tape("writeSQL", (t) => {
//   t.plan(2)
//
//   t.equal(writeSQL({
//     source: "contributions_donotmodify",
//     transform: [
//       {
//         "type": "formula",
//         "field": "contrib_date",
//         "as": "key0",
//         "dateTrunc": "year",
//         "cast": "timestamp"
//       },
//       {
//         "type": "aggregate",
//         "groupby": ["key0"],
//         "fields": ["amount"],
//         "ops": ["average"],
//         "as": ["series_1"]
//       },
//       {
//         "type": "collect",
//         "sort": { "field": "key0" }
//       },
//       {
//         "type": "filter",
//         "field": "contrib_date",
//         "range": ["1996-11-05 17:47:30", "2010-10-21 10:54:07"]
//       },
//       {
//         "type": "filter",
//         "isNull": false
//       }
//     ]
//   }), "SELECT date_trunc(year, CAST(contrib_date AS TIMESTAMP(0))) as key0, AVG(amount) AS series_1 FROM contributions_donotmodify WHERE (CAST(contrib_date AS TIMESTAMP(0)) >= TIMESTAMP(0) '1996-11-05 17:47:30' AND CAST(contrib_date AS TIMESTAMP(0)) <= TIMESTAMP(0) '2010-10-21 10:54:07') AND amount IS NOT NULL GROUP BY key0 ORDER BY key0")
//
//   t.equal(writeSQL({
//     source: "",
//     transform:[
//       {
//         "type": "formula",
//         "as": "key0",
//         "expr": "cast((cast(datum.airtime as float) - 0) * 0.008888888888888889 as int)"
//       },
//       {
//         "type": "aggregate",
//         "groupby": ["key0"],
//         "as": ["color", "val"]
//       },
//       {
//         "type": "bin",
//         "field": "key0",
//         "extent": [0, 1350],
//         "maxbins": 12
//       },
//       {
//         "type": "collect",
//         "sort": {
//           "field": ["val", "color"],
//           "order": ["descending", "descending"]
//         }
//       }
//     ]
//   }), "SELECT cast((cast(airtime as float) - 0) * 0.008888888888888889 as int) as key0, COUNT(*) AS val, COUNT(*) AS color FROM flights_donotmodify WHERE ((airtime >= 0 AND airtime <= 1350) OR (airtime IS NULL)) GROUP BY key0 HAVING (key0 >= 0 AND key0 < 12 OR key0 IS NULL) ORDER BY val DESC, color DESC LIMIT 10 ")
// })
