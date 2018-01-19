import parseExpressionDefault from "./parse-expression";
import parseDataStateDefault from "./parse-datastate";
import parseTransformDefault from "./parse-transform";
import parseSourceDefault from "./parse-source";
import writeSQLDefault, { write } from "./write-sql";

/**
 * Creates a parser than can parse expressions, transforms, and intermediary
 * SQL representations. This parser is used internally by the data graph.
 * @see {@link Parser} for further information.
 * @memberof API
 */
export function createParser() {
  var transformParsers = {};
  var expressionParsers = {};

  /**
   * A collection of functions used for parsing expressions, transforms, and
   * intermediary SQL representations
   * @namespace Parser
   */
  var parser = {
    parseExpression: parseExpression,
    parseTransform: parseTransform,
    parseDataState: parseDataState,
    parseSource: parseSource,
    writeSQL: writeSQL,
    write: write,
    registerParser: registerParser
  };

  /**
   * Returns all child data node instances of the graph.
   * @memberof Parser
   * @inner
   */
  function registerParser(definition, typeParser) {
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
  function parseExpression(expression) {
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
  function parseTransform(sql, transform) {
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
  function parseDataState(data, sql) {
    return parseDataStateDefault(data, parser, sql);
  }

  /**
   * Parses a source transform and returns a valid SQL FROM clause
   * @memberof Parser
   * @inner
   */
  function parseSource(sourceTransforms) {
    return parseSourceDefault(sourceTransforms, parser);
  }

  /**
  * Parses a data node state and returns a valid SQL string
   * @memberof Parser
   * @inner
   */
  function writeSQL(state) {
    return writeSQLDefault(state, parser);
  }

  return parser;
}

export default createParser();