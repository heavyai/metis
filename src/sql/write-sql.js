// @flow
import parse from "./parse-transform"

export default function writeSQL ({source, transform}: DataState): string {
  return write(parse(transform))
}

function write (data) {
  return writeSelect(data.select) + writeFrom(data.from) +
    writeWhere(data.where) + writeGroupby(data.groupby) +
    writeHaving(data.having)
}

function writeSelect (select) {
  return select.length ? "SELECT " + select.join(", ") : "SELECT *"
}

function writeFrom (from) {
  return "FROM " + from
}

function writeWhere (where) {
  return where.length ? "WHERE " + where.join(" AND ") : ""
}

function writeGroupby (groupby) {
  return groupby.length ? "GROUP BY " + groupby.join(", ") : ""
}

function writeHaving (having) {
  return having.length ? "HAVING " + having.join(" AND ") : ""
}
