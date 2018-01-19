"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseProject;

var _createParser = require("./create-parser");

var _createParser2 = _interopRequireDefault(_createParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseProject(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _createParser2.default;

  sql.select.push(parser.parseExpression(transform.expr) + (transform.as ? " as " + transform.as : ""));
  return sql;
}