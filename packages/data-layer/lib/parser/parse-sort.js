"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseSort;


var ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
};
function parseSort(sql, transform) {
  transform.field.forEach(function (field, index) {
    sql.orderby.push(field + (Array.isArray(transform.order) ? " " + ORDERINGS[transform.order[index]] : ""));
  });
  return sql;
}