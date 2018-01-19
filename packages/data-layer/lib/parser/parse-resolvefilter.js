"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = parseResolvefilter;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parseResolvefilter(sql, transform) {
  switch (transform.type) {
    case "resolvefilter":
      if (_typeof(sql.unresolved) === "object") {
        sql.unresolved[transform.filter.signal] = transform;
      } else {
        sql.unresolved = _defineProperty({}, transform.filter.signal, transform);
      }
    default:
      return sql;
  }
}