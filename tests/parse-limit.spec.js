// @flow
import tape from "tape";
import parseLimit from "../src/sql/parse-limit";

tape("parseLimit", assert => {
  assert.plan(1);
  assert.deepEqual(
    parseLimit(
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
        type: "limit",
        row: 1000,
        offset: 10
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
