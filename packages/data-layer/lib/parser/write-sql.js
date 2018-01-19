"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = writeSQL;
exports.write = write;
function writeSQL(state, parser) {
  return write(parser.parseDataState(state));
}
function write(sql) {
  return writeSelect(sql.select) + writeFrom(sql.from) + writeWhere(sql.where) + writeGroupby(sql.groupby) + writeHaving(sql.having) + writeOrderBy(sql.orderby) + writeLimit(sql.limit) + writeOffset(sql.offset);
}

function writeSelect(select) {
  return select.length ? "SELECT " + select.join(", ") : "SELECT *";
}

function writeFrom(from) {
  return " FROM " + from;
}

function writeWhere(where) {
  return where.length ? " WHERE " + where.join(" AND ") : "";
}

function writeGroupby(groupby) {
  return groupby.length ? " GROUP BY " + groupby.join(", ") : "";
}

function writeHaving(having) {
  return having.length ? " HAVING " + having.join(" AND ") : "";
}

function writeOrderBy(orderby) {
  return orderby.length ? " ORDER BY " + orderby.join(", ") : "";
}

function writeLimit(limit) {
  return limit.length ? " LIMIT " + limit : "";
}

function writeOffset(offset) {
  return offset.length ? " OFFSET " + offset : "";
}