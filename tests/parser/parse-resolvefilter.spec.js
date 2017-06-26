// @flow
import tape from "tape";
import parseResolvefilter from "../../src/parser/parse-resolvefilter";

tape("parseResolvefilter", assert => {
  assert.plan(1);
  assert.deepEqual(
    parseResolvefilter(
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
        type: "resolvefilter",
        filter: { signal: "xfilter" },
        ignore: "some-filter"
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
      offset: "",
      unresolved: {
        xfilter: {
          type: "resolvefilter",
          filter: { signal: "xfilter" },
          ignore: "some-filter"
        }
      }
    },
    "adds resolvefilter to unresolved hash"
  );
});
