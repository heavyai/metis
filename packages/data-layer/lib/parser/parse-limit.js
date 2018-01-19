"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseLimit;
function parseLimit(sql, transform) {
  sql.limit += transform.row;
  sql.offset += transform.offset || sql.offset;
  return sql;
}