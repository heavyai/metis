// @flow
import parseExpressionDefault from "./parse-expression";
import parseDataStateDefault from "./parse-datastate";
import parseTransformDefault from "./parse-transform";
import parseSourceDefault from "./parse-source";
import writeSQLDefault, { write } from "./write-sql";

import type { SQL } from "./write-sql";
import type { DataState } from "../create-data-node";

export type TypeDefinition = {
  meta: string,
  type: string
};

export type TypeParser = ExpressionParser | TransformParser;

type ExpressionParser = (expr: Expression | Object, parser: Parser) => string;
type TransformParser = (
  sql: SQL,
  transform: Transform | Object,
  parser: Parser
) => SQL;

export type Parser = {
  parseExpression: (expr: Expression) => string,
  parseTransform: (sql: SQL, transform: Transform) => SQL,
  parseDataState: (data: DataState, sql?: SQL) => SQL,
  parseSource: (sourceTransforms: Array<SourceTransform | DataState>) => string,
  writeSQL: (state: DataState) => string,
  write: (sql: SQL) => string,
  registerParser: (definition: TypeDefinition, typeParser: Function) => void
};

/**
 * Creates a parser than can parse expressions, transforms, and intermediary
 * SQL representations. This parser is used internally by the data graph.
 * @see {@link Parser} for further information.
 * @memberof API
 */
export function createParser(): Parser {
  const transformParsers = {};
  const expressionParsers = {};

  /**
   * A collection of functions used for parsing expressions, transforms, and
   * intermediary SQL representations
   * @namespace Parser
   */
  const parser = {
    parseExpression,
    parseTransform,
    parseDataState,
    parseSource,
    writeSQL,
    write,
    registerParser
  };

  /**
   * Returns all child data node instances of the graph.
   * @memberof Parser
   * @inner
   */
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

  /**
   * Parses expressions and returns a valid SQL expression string
   * @memberof Parser
   * @inner
   * @see {@link Expression} for further information.
   */
  function parseExpression(expression: Expression): string {
    if (expressionParsers[expression.type]) {
      return expressionParsers[expression.type](expression, parser);
    }
    return parseExpressionDefault(expression, parser);
  }

  /**
   * Parses transforms and returns an intermediary SQL representation
   * @memberof Parser
   * @inner
   * @see {@link Transform} for further information.
   */
  function parseTransform(sql: SQL, transform: Transform): SQL {
    if (transformParsers[transform.type]) {
      return transformParsers[transform.type](sql, transform, parser);
    }
    return parseTransformDefault(sql, transform, parser);
  }

  /**
   * Parses a data node state and returns an intermediary SQL representation
   * @memberof Parser
   * @inner
   */
  function parseDataState(data: DataState, sql?: SQL): SQL {
    return parseDataStateDefault(data, parser, sql);
  }

  /**
   * Parses a source transform and returns a valid SQL FROM clause
   * @memberof Parser
   * @inner
   */
  function parseSource(
    sourceTransforms: Array<SourceTransform | DataState>
  ): string {
    return parseSourceDefault(sourceTransforms, parser);
  }

  /**
  * Parses a data node state and returns a valid SQL string
   * @memberof Parser
   * @inner
   */
  function writeSQL(state: DataState): string {
    return writeSQLDefault(state, parser);
  }

  return parser;
}

export default createParser();
