"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createParser = createParser;

var _parseExpression = require("./parse-expression");

var _parseExpression2 = _interopRequireDefault(_parseExpression);

var _parseDatastate = require("./parse-datastate");

var _parseDatastate2 = _interopRequireDefault(_parseDatastate);

var _parseTransform = require("./parse-transform");

var _parseTransform2 = _interopRequireDefault(_parseTransform);

var _parseSource = require("./parse-source");

var _parseSource2 = _interopRequireDefault(_parseSource);

var _writeSql = require("./write-sql");

var _writeSql2 = _interopRequireDefault(_writeSql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a parser than can parse expressions, transforms, and intermediary
 * SQL representations. This parser is used internally by the data graph.
 * @see {@link Parser} for further information.
 * @memberof API
 */
function createParser() {
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
    write: _writeSql.write,
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
    return (0, _parseExpression2.default)(expression, parser);
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
    return (0, _parseTransform2.default)(sql, transform, parser);
  }

  /**
   * Parses a data node state and returns an intermediary SQL representation
   * @memberof Parser
   * @inner
   */
  function parseDataState(data, sql) {
    return (0, _parseDatastate2.default)(data, parser, sql);
  }

  /**
   * Parses a source transform and returns a valid SQL FROM clause
   * @memberof Parser
   * @inner
   */
  function parseSource(sourceTransforms) {
    return (0, _parseSource2.default)(sourceTransforms, parser);
  }

  /**
  * Parses a data node state and returns a valid SQL string
   * @memberof Parser
   * @inner
   */
  function writeSQL(state) {
    return (0, _writeSql2.default)(state, parser);
  }

  return parser;
}
exports.default = createParser();