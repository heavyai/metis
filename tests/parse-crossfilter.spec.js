// @flow
import tape from "tape";
import parseCrossfilter from "../src/parser/parse-crossfilter";

tape("parseCrossfilter", assert => {
  assert.plan(3);

  assert.deepEqual(
    parseCrossfilter(
      {
        select: [],
        from: "",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: "",
        unresolved: {
          xfilter: {
            type: "resolvefilter",
            filter: { signal: "xfilter" },
            ignore: "some-filter"
          }
        }
      },
      {
        type: "crossfilter",
        signal: "xfilter",
        filter: [
          {
            type: "filter",
            id: "some-filter",
            expr: "party = 'R'"
          },
          {
            type: "filter",
            id: "another-filter",
            expr: {
              type: "=",
              left: "party",
              right: "D"
            }
          }
        ]
      }
    ),
    {
      select: [],
      from: "",
      where: ["(party = 'D')"],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: "",
      unresolved: {
        xfilter: {
          type: "resolvefilter",
          filter: { signal: "xfilter" },
          ignore: "some-filter"
        }
      }
    },
    "should properly ignore filter"
  );

  assert.deepEqual(
    parseCrossfilter(
      {
        select: [],
        from: "",
        where: [],
        groupby: [],
        having: [],
        orderby: [],
        limit: "",
        offset: "",
        unresolved: {
          xfilter: {
            type: "resolvefilter",
            filter: { signal: "xfilter" },
            ignore: ["some-filter", "another-filter"]
          }
        }
      },
      {
        type: "crossfilter",
        signal: "xfilter",
        filter: [
          {
            type: "filter",
            id: "some-filter",
            expr: "party = 'R'"
          },
          {
            type: "filter",
            id: "another-filter",
            expr: {
              type: "=",
              left: "party",
              right: "D"
            }
          },
          {
            type: "filter",
            id: "test-filter",
            expr: {
              type: "<",
              left: "amount",
              right: 100
            }
          }
        ]
      }
    ),
    {
      select: [],
      from: "",
      where: ["(amount < 100)"],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: "",
      unresolved: {
        xfilter: {
          type: "resolvefilter",
          filter: { signal: "xfilter" },
          ignore: ["some-filter", "another-filter"]
        }
      }
    },
    "should properly ignore filters"
  );

  assert.deepEqual(
    parseCrossfilter(
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
        type: "crossfilter",
        signal: "xfilter",
        filter: [
          {
            type: "filter",
            id: "some-filter",
            expr: "party = 'R'"
          },
          {
            type: "filter",
            id: "another-filter",
            expr: {
              type: "=",
              left: "party",
              right: "D"
            }
          }
        ]
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
    },
    "should completely ignore filters if no corresponding resolvefilter"
  );
});
