// @flow
import tape from "tape";
import parse from "../src/parser/parse-datastate";
import aggregate from "../src/parser/parse-aggregate";
import bin from "../src/parser/parse-bin";
import sample from "../src/parser/parse-sample";
import { createParser } from "../src/parser/create-parser";
const { parseDataState } = createParser();

tape("parseDataState", assert => {
  assert.plan(1);
  assert.deepEqual(
    parseDataState({
      type: "root",
      name: "test",
      source: "taxis",
      children: [],
      transform: [
        {
          type: "bin",
          field: "total_amount",
          extent: [-21474830, 3950611.6],
          maxbins: 12,
          as: "key0"
        },
        {
          type: "aggregate",
          fields: ["*"],
          ops: ["count"],
          as: ["series_1"]
        },
        {
          type: "filter",
          id: "test",
          expr: "dropoff_longitude >= -73.99460014891815 AND dropoff_longitude <= -73.78028987584129"
        },
        {
          type: "filter",
          id: "test",
          expr: {
            type: "between",
            field: "dropoff_latitude",
            left: 40.63646686110235,
            right: 40.81468768513369
          }
        },
        {
          type: "sample",
          method: "multiplicative",
          size: 688850,
          limit: 2000000
        }
      ]
    }),
    {
      select: [
        "cast((cast(total_amount as float) - -21474830) * 4.719682036909046e-7 as int) as key0",
        "COUNT(*) as series_1"
      ],
      from: "taxis",
      where: [
        "((total_amount >= -21474830 AND total_amount <= 3950611.6) OR (total_amount IS NULL))",
        "(dropoff_longitude >= -73.99460014891815 AND dropoff_longitude <= -73.78028987584129)",
        "(dropoff_latitude BETWEEN 40.63646686110235 AND 40.81468768513369)"
      ],
      groupby: ["key0"],
      having: ["(key0 >= 0 AND key0 < 12 OR key0 IS NULL)"],
      orderby: [],
      limit: "",
      offset: "",
      unresolved: {}
    }
  );
});

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
        "COUNT(*) as y",
        "date_trunc(day, dep_timestamp) as x",
        "extract(month from dep_timestamp) as z"
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
      select: ["COUNT(*) as y", "date_trunc(day, dep_timestamp) as x"],
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
        fields: ["key0"],
        ops: ["count"],
        groupby: "key0"
      }
    ),
    {
      select: ["COUNT(key0)"],
      from: "",
      where: [],
      groupby: ["key0"],
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
        groupby: ["key0", "val"]
      }
    ),
    {
      select: ["AVG(airtime) as val", "COUNT(depdelay) as color"],
      from: "",
      where: [],
      groupby: ["key0", "val"],
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
        ops: ["sum", "min"]
      }
    ),
    {
      select: ["SUM(airtime)", "MIN(depdelay)"],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
});

tape("bin", assert => {
  assert.plan(1);
  assert.deepEqual(
    bin(
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
        type: "bin",
        field: "airtime",
        as: "key0",
        extent: [0, 1350],
        maxbins: 12
      }
    ),
    {
      select: [
        "cast((cast(airtime as float) - 0) * 0.008888888888888889 as int) as key0"
      ],
      from: "",
      where: ["((airtime >= 0 AND airtime <= 1350) OR (airtime IS NULL))"],
      groupby: ["key0"],
      having: ["(key0 >= 0 AND key0 < 12 OR key0 IS NULL)"],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
});

tape("sample", assert => {
  assert.plan(2);
  assert.deepEqual(
    sample(
      {
        select: [],
        from: "taxis",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: ""
      },
      {
        type: "sample",
        method: "multiplicative",
        size: 688850518,
        limit: 2000000
      }
    ),
    {
      select: [],
      from: "taxis",
      where: ["MOD(taxis.rowid * 265445761, 4294967296) < 12469954"],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    sample(
      {
        select: [],
        from: "taxis",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: ""
      },
      {
        type: "sample",
        method: "multiplicative",
        size: 688850,
        limit: 2000000
      }
    ),
    {
      select: [],
      from: "taxis",
      where: [],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
});
