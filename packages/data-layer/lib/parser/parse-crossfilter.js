"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = parseCrossfilter;

var _createParser = require("./create-parser");

var _createParser2 = _interopRequireDefault(_createParser);

var _parseFilter = require("./parse-filter");

var _parseFilter2 = _interopRequireDefault(_parseFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseCrossfilter(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _createParser2.default;

  switch (transform.type) {
    case "crossfilter":
      if (_typeof(sql.unresolved) === "object") {
        if (sql.unresolved.hasOwnProperty(transform.signal)) {
          Object.keys(transform.filter).forEach(function (key) {
            var filter = transform.filter[key];
            if (sql.unresolved) {
              var ignore = sql.unresolved[transform.signal].ignore;

              if (Array.isArray(ignore) ? ignore.indexOf(key) === -1 : key !== ignore) {
                (0, _parseFilter2.default)(sql, filter, parser);
              }
            }
          });
        }
      }
    default:
      return sql;
  }
}