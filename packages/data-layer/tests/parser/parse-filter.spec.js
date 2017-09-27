// @flow
import tape from "tape";
import filter from "../../src/parser/parse-filter";

tape("filter", assert => {
  assert.plan(4);
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
        type: "filter",
        id: "test",
        expr: {
          type: "between",
          field: "dropoff_longitude",
          left: -73.99460014891815,
          right: -73.78028987584129
        }
      }
    ),
    {
      select: [],
      from: "",
      where: [
        "(dropoff_longitude BETWEEN -73.99460014891815 AND -73.78028987584129)"
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
        type: "filter",
        id: "test",
        expr: {
          type: "=",
          left: "recipient_party",
          right: "R"
        }
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
        type: "filter",
        id: "test",
        expr: {
          type: "in",
          expr: "recipient_party",
          set: ["R", "D", "I"]
        }
      }
    ),
    {
      select: [],
      from: "",
      where: ["(recipient_party IN ('R', 'D', 'I'))"],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
  // assert.deepEqual(
  //   filter(
  //     {
  //       select: [],
  //       from: "",
  //       where: [],
  //       groupby: [],
  //       having: [],
  //       orderby: [],
  //       limit: "",
  //       offset: ""
  //     },
  //     {
  //       type: "filter.operation",
  //       id: "test",
  //       filters: [
  //         [
  //           {
  //             type: "=",
  //             left: "recipient_party",
  //             right: "R"
  //           },
  //           {
  //             type: "=",
  //             left: "recipient_party",
  //             right: "D"
  //           }
  //         ],
  //         {
  //           type: "ilike",
  //           left: "state",
  //           right: "dakota"
  //         }
  //       ]
  //     }
  //   ),
  //   {
  //     select: [],
  //     from: "",
  //     where: [
  //       `((recipient_party = 'R' OR recipient_party = 'D') AND (state ILIKE %"dakota"%))`
  //     ],
  //     groupby: [],
  //     having: [],
  //     orderby: [],
  //     limit: "",
  //     offset: ""
  //   }
  // );
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
        type: "filter",
        id: "test",
        expr: {
          type: "not",
          expr: {
            type: "<>",
            left: "recipient_party",
            right: "R"
          }
        }
      }
    ),
    {
      select: [],
      from: "",
      where: [`(NOT(recipient_party <> 'R'))`],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: ""
    }
  );
});
