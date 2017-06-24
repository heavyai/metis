// @flow
import tape from "tape";
import { createParser } from "../src/parser/create-parser";

tape("parser", assert => {
  assert.plan(2);

  const Parser = createParser();

  Parser.registerParser({ meta: "expression", type: "custom" }, () => "TEST");
  Parser.registerParser({ meta: "transform", type: "custom" }, () => "TEST");

  assert.equal(Parser.parseExpression({ type: "custom" }), "TEST");
  assert.equal(
    Parser.parseTransform(
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
      { type: "custom" }
    ),
    "TEST"
  );
});
