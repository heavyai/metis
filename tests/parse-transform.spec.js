// @flow
import tape from "tape";
import parse from "../src/sql/parse-transform";
import aggregate from "../src/sql/parse-aggregate";
import bin from "../src/sql/parse-bin";
import collect from "../src/sql/parse-collect";
import filter from "../src/sql/parse-filter";
import formula from "../src/sql/parse-formula";
import sample from "../src/sql/parse-sample";

tape("parse", assert => {
  assert.plan(1);
  assert.deepEqual(
    parse({
      name: "test",
      source: "taxis",
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
          type: "filter.range",
          id: "test",
          field: "dropoff_latitude",
          range: [40.63646686110235, 40.81468768513369]
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
        "(dropoff_latitude >= 40.63646686110235 AND dropoff_latitude <= 40.81468768513369)"
      ],
      groupby: ["key0"],
      having: ["(key0 >= 0 AND key0 < 12 OR key0 IS NULL)"],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
});

tape("aggregate", assert => {
  assert.plan(3);
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

tape("collect", assert => {
  assert.plan(4);
  assert.deepEqual(
    collect(
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
        type: "collect.sort",
        sort: { field: ["amount"], order: ["ascending"] }
      }
    ),
    {
      select: [],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: ["amount ASC"],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    collect(
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
        type: "collect.sort",
        sort: { field: ["amount"] }
      }
    ),
    {
      select: [],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: ["amount"],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    collect(
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
        type: "collect.sort",
        sort: { field: ["amount", "key0"], order: ["descending", "descending"] }
      }
    ),
    {
      select: [],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: ["amount DESC", "key0 DESC"],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    collect(
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
        type: "collect.limit",
        limit: { row: 1000, offset: 10 }
      }
    ),
    {
      select: [],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: [],
      limit: "1000",
      offset: "10"
    }
  );
});

tape("formula", assert => {
  assert.plan(3);
  assert.deepEqual(
    formula(
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
        type: "formula.extract",
        field: "arr_timestamp",
        unit: "year",
        as: "key0"
      }
    ),
    {
      select: ["extract(year from arr_timestamp) as key0"],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    formula(
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
        type: "formula.date_trunc",
        field: "arr_timestamp",
        unit: "quarter",
        as: "key0"
      }
    ),
    {
      select: ["date_trunc(quarter, arr_timestamp) as key0"],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  assert.deepEqual(
    formula(
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
        type: "formula",
        expr: "cast((cast(total_amount as float) - -21474830) * 4.719682036909046e-7 as int)",
        as: "key0"
      }
    ),
    {
      select: [
        "cast((cast(total_amount as float) - -21474830) * 4.719682036909046e-7 as int) as key0"
      ],
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

tape("filter", assert => {
  assert.plan(3);
  assert.deepEqual(
    filter(
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
        type: "filter.range",
        id: "test",
        field: "dropoff_longitude",
        range: [-73.99460014891815, -73.78028987584129]
      }
    ),
    {
      select: [],
      from: "",
      where: [
        "(dropoff_longitude >= -73.99460014891815 AND dropoff_longitude <= -73.78028987584129)"
      ],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );

  assert.deepEqual(
    filter(
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
        type: "filter.exact",
        id: "test",
        field: "recipient_party",
        equals: "R"
      }
    ),
    {
      select: [],
      from: "",
      where: ["(recipient_party = 'R')"],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );

  assert.deepEqual(
    filter(
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
        type: "filter.exact",
        id: "test",
        field: "recipient_party",
        equals: ["R", "D", "I"]
      }
    ),
    {
      select: [],
      from: "",
      where: [
        "(recipient_party = 'R' OR recipient_party = 'D' OR recipient_party = 'I')"
      ],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
});

tape("sample", assert => {
  assert.plan(1);
  assert.deepEqual(
    sample(
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
        type: "sample",
        size: 10
      }
    ),
    {
      select: [],
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
