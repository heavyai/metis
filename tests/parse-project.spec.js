// @flow
import tape from "tape";
import parseProject from "../src/parser/parse-project";

tape("parseProject", assert => {
  assert.plan(5);

  assert.deepEqual(
    parseProject(
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
        type: "project",
        expr: "city"
      }
    ),
    {
      select: ["city"],
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
    parseProject(
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
        type: "project",
        expr: "AVG(amount)",
        as: "val"
      }
    ),
    {
      select: ["AVG(amount) as val"],
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
    parseProject(
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
        type: "project",
        expr: {
          type: "date_trunc",
          unit: "quarter",
          field: "contrib_date"
        },
        as: "key0"
      }
    ),
    {
      select: ["date_trunc(quarter, contrib_date) as key0"],
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
    parseProject(
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
        type: "project",
        expr: {
          type: "extract",
          unit: "day",
          field: "contrib_date"
        },
        as: "key0"
      }
    ),
    {
      select: ["extract(day from contrib_date) as key0"],
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
    parseProject(
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
        type: "project",
        expr: {
          type: "case",
          cond: [
            [
              {
                type: "in",
                expr: "recipient_party",
                set: ["R", "D", "I", "3", "L"]
              },
              "recipient_party"
            ]
          ],
          else: "other"
        },
        as: "key1"
      }
    ),
    {
      select: [
        "CASE WHEN recipient_party IN ('R', 'D', 'I', '3', 'L') THEN recipient_party ELSE 'other' END as key1"
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
