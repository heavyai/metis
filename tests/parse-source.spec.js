// @flow
import tape from "tape";
import parseSource from "../src/parser/parse-source";

tape("parseSource", assert => {
  assert.plan(2);
  assert.deepEqual(
    parseSource([
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
        type: "join.right",
        as: "table2"
      }
    ]),
    "flights JOIN zipcode as table1 RIGHT JOIN contrib as table2"
  );

  assert.deepEqual(
    parseSource([
      {
        type: "scan",
        table: "flights"
      },
      {
        type: "scan",
        table: "zipcode"
      },
      {
        type: "join.inner",
        as: "table1"
      },
      {
        type: "root",
        source: "flights",
        name: "test",
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
      },
      {
        type: "join.left",
        as: "table2"
      }
    ]),
    "flights INNER JOIN zipcode as table1 LEFT JOIN (SELECT dest_city, AVG(depdelay) as val FROM flights GROUP BY dest_city) as table2"
  );
});
