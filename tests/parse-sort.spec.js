// @flow
import tape from "tape";
import parseSort from "../src/parser/parse-sort";

tape("parseSort", assert => {
  assert.plan(3);
  assert.deepEqual(
    parseSort(
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
        type: "sort",
        field: ["amount"],
        order: ["ascending"]
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
    parseSort(
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
        type: "sort",
        field: ["amount"]
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
    parseSort(
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
        type: "sort",
        field: ["amount", "key0"],
        order: ["descending", "descending"]
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
});
