// @flow
import tape from "tape";
import aggregate from "../../src/parser/parse-aggregate";

tape("aggregate", assert => {
  assert.plan(5);
  assert.deepEqual(
    aggregate(
      {
        select: [],
        from: "",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: ""
      },
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["y"],
        groupby: [
          {
            type: "project",
            expr: {
              type: "date_trunc",
              unit: "day",
              field: "dep_timestamp"
            },
            as: "x"
          },
          {
            type: "project",
            expr: {
              type: "extract",
              unit: "month",
              field: "dep_timestamp"
            },
            as: "z"
          }
        ]
      }
    ),
    {
      select: [
        "date_trunc(day, dep_timestamp) AS x",
        "extract(month from dep_timestamp) AS z",
        "COUNT(*) AS y"
      ],
      from: "",
      where: [],
      groupby: ["x", "z"],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    aggregate(
      {
        select: [],
        from: "",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: ""
      },
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["y"],
        groupby: {
          type: "project",
          expr: {
            type: "date_trunc",
            unit: "day",
            field: "dep_timestamp"
          },
          as: "x"
        }
      }
    ),
    {
      select: ["date_trunc(day, dep_timestamp) AS x", "COUNT(*) AS y"],
      from: "",
      where: [],
      groupby: ["x"],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    aggregate(
      {
        select: [],
        from: "",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: ""
      },
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["key0"],
        groupby: "party"
      }
    ),
    {
      select: ["party", "COUNT(*) AS key0"],
      from: "",
      where: [],
      groupby: ["party"],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    aggregate(
      {
        select: [],
        from: "",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: ""
      },
      {
        type: "aggregate",
        fields: ["airtime", "depdelay"],
        ops: ["average", "count"],
        as: ["val", "color"],
        groupby: ["city", "state"]
      }
    ),
    {
      select: [
        "city",
        "state",
        "AVG(airtime) AS val",
        "COUNT(depdelay) AS color"
      ],
      from: "",
      where: [],
      groupby: ["city", "state"],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    aggregate(
      {
        select: [],
        from: "",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: ""
      },
      {
        type: "aggregate",
        fields: ["airtime", "depdelay"],
        ops: ["sum", "min"],
        as: ["val", "color"],
        groupby: "carrier"
      }
    ),
    {
      select: ["carrier", "SUM(airtime) AS val", "MIN(depdelay) AS color"],
      from: "",
      where: [],
      groupby: ["carrier"],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
});
