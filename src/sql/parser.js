import parseExpressionDefault from "./parse-expression";
import parseTransformDefault from "./parse-transform";
import parseSourceDefault from "./parse-source";
import writeSQLDefault from "./write-sql";

const parser = {
  parseExpression,
  parseTransform,
  parseSource,
  writeSQL
};

function parseExpression(expression) {
  return parseExpressionDefault(expression, parser);
}

function parseTransform(data) {
  return parseTransformDefault(data, parser);
}

function parseSource(transforms) {
  return parseSourceDefault(transforms, parser);
}

function writeSQL(state) {
  return writeSQLDefault(state, parser);
}

export default parser;
