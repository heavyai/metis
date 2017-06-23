// @flow
import parseExpressionDefault from "./parse-expression";
import parseDataStateDefault from "./parse-datastate";
import parseTransformDefault from "./parse-transform";
import parseSourceDefault from "./parse-source";
import writeSQLDefault, { write } from "./write-sql";

export function createParser(): Parser {
  const transformParsers = {};
  const expressionParsers = {};

  const parser = {
    parseExpression,
    parseTransform,
    parseDataState,
    parseSource,
    writeSQL,
    write,
    registerParser
  };

  function registerParser(
    definition: TypeDefinition,
    typeParser: Function
  ): void {
    if (definition.meta === "expression") {
      expressionParsers[definition.type] = typeParser;
    } else if (definition.meta === "transform") {
      transformParsers[definition.type] = typeParser;
    }
  }

  function parseExpression(expression: Expression): string {
    if (expressionParsers[expression.type]) {
      return expressionParsers[expression.type](expression, parser);
    }
    return parseExpressionDefault(expression, parser);
  }

  function parseTransform(sql: SQL, transform: Transform): SQL {
    if (transformParsers[transform.type]) {
      return transformParsers[transform.type](sql, transform, parser);
    }
    return parseTransformDefault(sql, transform, parser);
  }

  function parseDataState(data: DataState, sql?: SQL): SQL {
    return parseDataStateDefault(data, parser, sql);
  }

  function parseSource(
    sourceTransforms: Array<SourceTransform | DataState>
  ): string {
    return parseSourceDefault(sourceTransforms, parser);
  }

  function writeSQL(state: DataState): string {
    return writeSQLDefault(state, parser);
  }

  return parser;
}

export default createParser();
