// @flow
import parseExpressionDefault from "./parse-expression";
import parseDataState from "./parse-datastate";
import parseTransformDefault from "./parse-transform";
import parseSourceDefault from "./parse-source";
import writeSQLDefault, { write } from "./write-sql";

export function createParser(): Parser {
  const transformParsers = {};
  const expressionParsers = {};
  const sourceParsers = {};

  const parser = {
    parseExpression,
    parseTransform,
    parseDataState,
    parseSource,
    writeSQL,
    write,
    registerParser
  };

  function registerParser(definition: TypeDefinition, typeParser: Function) {
    switch (definition.meta) {
      case "expression":
        expressionParsers[definition.type] = typeParser;
        return;
      case "transform":
        transformParsers[definition.type] = typeParser;
        return;
      case "source":
        sourceParsers[definition.type] = typeParser;
        return;
      default:
        return;
    }
  }

  function parseExpression(expression: Expression): string {
    if (expressionParsers[expression.type]) {
      return expressionParsers[expression.type](expression, parser);
    }
    return parseExpressionDefault(expression, parser);
  }

  function parseSource(transforms) {
    if (sourceParsers[transforms.type]) {
      return sourceParsers[transforms.type](transforms, parser);
    }
    return parseSourceDefault(transforms, parser);
  }

  function parseTransform(sql, transform) {
    if (transformParsers[transform.type]) {
      return transformParsers[transform.type](sql, transform);
    }
    return parseTransformDefault(sql, transform, parser);
  }

  function writeSQL(state) {
    return writeSQLDefault(state, parser);
  }

  return parser;
}

export default createParser();
