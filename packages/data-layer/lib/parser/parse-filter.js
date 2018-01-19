"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = parseFilter;

var _createParser = require("./create-parser");

var _createParser2 = _interopRequireDefault(_createParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseFilter(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _createParser2.default;

  switch (transform.type) {
    case "filter":
      sql.where.push("(" + (_typeof(transform.expr) === "object" ? parser.parseExpression(transform.expr) : transform.expr) + ")");
    default:
      return sql;
  }
}