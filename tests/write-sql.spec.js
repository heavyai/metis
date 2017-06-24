// @flow
import tape from "tape";
import { createParser } from "../src/parser/create-parser";
const { writeSQL } = createParser();

tape("writeSQL", assert => {
  assert.plan(6);

  assert.equal(
    writeSQL({
      type: "root",
      source: "flights",
      name: "test",
      transform: [],
      children: []
    }),
    "SELECT * FROM flights"
  );

  assert.equal(
    writeSQL({
      type: "root",
      source: "flights",
      name: "test",
      children: [],
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
      ]
    }),
    "SELECT dest_city, AVG(depdelay) as val FROM flights GROUP BY dest_city"
  );

  assert.equal(
    writeSQL({
      type: "root",
      source: "contributions",
      name: "test",
      children: [],
      transform: [
        {
          type: "filter",
          id: "test",
          expr: "recipient_party = R OR recipient_party = D"
        }
      ]
    }),
    "SELECT * FROM contributions WHERE (recipient_party = R OR recipient_party = D)"
  );

  assert.equal(
    writeSQL({
      type: "root",
      source: "flights",
      name: "test",
      children: [],
      transform: [
        {
          type: "bin",
          field: "airtime",
          extent: [-3818, 3508],
          maxbins: 12,
          as: "key0"
        },
        {
          type: "bin",
          field: "distance",
          extent: [0, 4983],
          maxbins: 12,
          as: "key1"
        },
        {
          type: "aggregate",
          fields: ["*"],
          ops: ["count"],
          as: ["val"]
        },
        {
          type: "sort",
          field: ["val"],
          order: ["descending"]
        },
        {
          type: "limit",
          row: 10
        }
      ]
    }),
    "SELECT cast((cast(airtime as float) - -3818) * 0.001638001638001638 as int) as key0, cast((cast(distance as float) - 0) * 0.002408187838651415 as int) as key1, COUNT(*) as val FROM flights WHERE ((airtime >= -3818 AND airtime <= 3508) OR (airtime IS NULL)) AND ((distance >= 0 AND distance <= 4983) OR (distance IS NULL)) GROUP BY key0, key1 HAVING (key0 >= 0 AND key0 < 12 OR key0 IS NULL) AND (key1 >= 0 AND key1 < 12 OR key1 IS NULL) ORDER BY val DESC LIMIT 10"
  );

  assert.equal(
    writeSQL({
      type: "root",
      source: "contributions",
      name: "test",
      children: [],
      transform: [
        {
          type: "project",
          expr: {
            type: "date_trunc",
            unit: "year",
            field: "CAST(contrib_date AS TIMESTAMP(0))"
          },
          as: "key0"
        },
        {
          type: "aggregate",
          groupby: ["key0"],
          fields: ["amount"],
          ops: ["average"],
          as: ["series_1"]
        },
        {
          type: "sort",
          field: ["key0"]
        },
        {
          type: "filter",
          id: "test",
          expr: {
            type: "between",
            field: "CAST(contrib_date AS TIMESTAMP(0))",
            left: "TIMESTAMP(0) '1996-11-05 17:47:30'",
            right: "TIMESTAMP(0) '2010-10-21 10:54:07'"
          }
        },
        {
          type: "filter",
          id: "test",
          expr: "amount IS NOT NULL"
        }
      ]
    }),
    "SELECT date_trunc(year, CAST(contrib_date AS TIMESTAMP(0))) as key0, AVG(amount) as series_1 FROM contributions WHERE (CAST(contrib_date AS TIMESTAMP(0)) BETWEEN TIMESTAMP(0) '1996-11-05 17:47:30' AND TIMESTAMP(0) '2010-10-21 10:54:07') AND (amount IS NOT NULL) GROUP BY key0 ORDER BY key0"
  );

  assert.equal(
    writeSQL({
      type: "root",
      source: [
        {
          type: "scan",
          table: "flights"
        },
        {
          type: "scan",
          table: "zipcode"
        },
        {
          type: "join",
          as: "table1"
        },
        {
          type: "scan",
          table: "contrib"
        },
        {
          type: "join",
          as: "table2"
        }
      ],
      name: "test",
      children: [],
      transform: []
    }),
    "SELECT * FROM flights JOIN zipcode as table1 JOIN contrib as table2"
  );
});
