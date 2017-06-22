import tape from "tape";
import { createParser } from "../src/sql/parser";

tape("parser", assert => {
  assert.plan(1);

  const Parser = createParser();

  Parser.registerParser({ meta: "expression", type: "custom" }, () => "TEST");

  assert.equal(Parser.parseExpression({ type: "custom" }), "TEST");
});
