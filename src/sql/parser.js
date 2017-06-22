import parseExpressionDefault from "./parse-expression";
import parseTransformDefault from "./parse-transform";
import parseSourceDefault from "./parse-source";
import writeSQLDefault, { write } from "./write-sql";
//
// type TypeDefinition = {
//   meta: string,
//   type: string
// }

export function createParser() {
  const transformParsers = {};
  const expressionParsers = {};
  const sourceParsers = {};

  const parser = {
    parseExpression,
    parseTransform,
    parseSource,
    writeSQL,
    write,
    registerParser
  };

  function registerParser(definition, parser) {
    switch (definition.meta) {
      case "expression":
        expressionParsers[definition.type] = parser;
        return;
      case "transform":
        transformParsers[definition.type] = parser;
        return;
      case "source":
        sourceParsers[definition.type] = parser;
        return;
      default:
        return;
    }
  }

  function parseExpression(expression) {
    if (expressionParsers[expression.type]) {
      return expressionParsers[expression.type](expression, parser);
    }
    return parseExpressionDefault(expression, parser);
  }

  function parseTransform(data, p, sql) {
    // if (transformParsers[data.type]) {
    //   return transformParsers[data.type](data, parser)
    // }
    return parseTransformDefault(data, p, sql);
  }

  function parseSource(transforms) {
    if (sourceParsers[transforms.type]) {
      return sourceParsers[transforms.type](transforms, parser);
    }
    return parseSourceDefault(transforms, parser);
  }

  function writeSQL(state) {
    return writeSQLDefault(state, parser);
  }

  return parser;
}

export default createParser();
