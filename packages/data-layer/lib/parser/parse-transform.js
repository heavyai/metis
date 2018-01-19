"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseTransform;

var _parseAggregate = require("./parse-aggregate");

var _parseAggregate2 = _interopRequireDefault(_parseAggregate);

var _parseBin = require("./parse-bin");

var _parseBin2 = _interopRequireDefault(_parseBin);

var _parseCrossfilter = require("./parse-crossfilter");

var _parseCrossfilter2 = _interopRequireDefault(_parseCrossfilter);

var _parseSort = require("./parse-sort");

var _parseSort2 = _interopRequireDefault(_parseSort);

var _parseLimit = require("./parse-limit");

var _parseLimit2 = _interopRequireDefault(_parseLimit);

var _parseFilter = require("./parse-filter");

var _parseFilter2 = _interopRequireDefault(_parseFilter);

var _parseProject = require("./parse-project");

var _parseProject2 = _interopRequireDefault(_parseProject);

var _parseResolvefilter = require("./parse-resolvefilter");

var _parseResolvefilter2 = _interopRequireDefault(_parseResolvefilter);

var _parseSample = require("./parse-sample");

var _parseSample2 = _interopRequireDefault(_parseSample);

var _parseSource = require("./parse-source");

var _parseSource2 = _interopRequireDefault(_parseSource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseTransform(sql, t, parser) {
  switch (t.type) {
    case "aggregate":
      return (0, _parseAggregate2.default)(sql, t, parser);
    case "bin":
      return (0, _parseBin2.default)(sql, t);
    case "sort":
      return (0, _parseSort2.default)(sql, t);
    case "limit":
      return (0, _parseLimit2.default)(sql, t);
    case "filter":
      return (0, _parseFilter2.default)(sql, t, parser);
    case "project":
      return (0, _parseProject2.default)(sql, t, parser);
    case "sample":
      return (0, _parseSample2.default)(sql, t);
    case "resolvefilter":
      return (0, _parseResolvefilter2.default)(sql, t);
    case "crossfilter":
      return (0, _parseCrossfilter2.default)(sql, t);
    /* istanbul ignore next */
    default:
      return sql;
  }
}