"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseBin;
function parseBin(sql, _ref) {
  var field = _ref.field,
      as = _ref.as,
      extent = _ref.extent,
      maxbins = _ref.maxbins;

  sql.select.push("cast((cast(" + field + " as float) - " + extent[0] + ") * " + maxbins / (extent[1] - extent[0]) + " as int) as " + as);
  sql.where.push("((" + field + " >= " + extent[0] + " AND " + field + " <= " + extent[1] + ") OR (" + field + " IS NULL))");
  sql.having.push("(" + as + " >= 0 AND " + as + " < " + maxbins + " OR " + as + " IS NULL)");
  return sql;
}