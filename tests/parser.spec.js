import tape from "tape";
import { createParser } from "../src/sql/parser";

tape("parser", assert => {
  assert.plan(3);

  const Parser = createParser();

  Parser.registerParser({ meta: "expression", type: "custom" }, () => "TEST");
  Parser.registerParser({ meta: "transform", type: "custom" }, () => "TEST");
  Parser.registerParser({ meta: "source", type: "custom" }, () => "TEST");

  assert.equal(Parser.parseExpression({ type: "custom" }), "TEST");
  assert.equal(Parser.parseTransform({}, { type: "custom" }), "TEST");
  assert.equal(Parser.parseSource({ type: "custom" }), "TEST");
});