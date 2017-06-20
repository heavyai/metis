// @flow
import Parser from "./parser";
/**
 * Returns a SQL query string based on the DataState passed in.
* @memberof API
 */
export default function writeSQL(state: DataState, parser: any = Parser): string {
  console.log(parser)
  return write(parser.parseTransform(state));
}

function write(sql: SQL): string {
  return (
    writeSelect(sql.select) +
    writeFrom(sql.from) +
    writeWhere(sql.where) +
    writeGroupby(sql.groupby) +
    writeHaving(sql.having) +
    writeOrderBy(sql.orderby) +
    writeLimit(sql.limit) +
    writeOffset(sql.offset)
  );
}

function writeSelect(select: Array<string>): string {
  return select.length ? "SELECT " + select.join(", ") : "SELECT *";
}

function writeFrom(from: string): string {
  return " FROM " + from;
}

function writeWhere(where: Array<string>): string {
  return where.length ? " WHERE " + where.join(" AND ") : "";
}

function writeGroupby(groupby: Array<string>): string {
  return groupby.length ? " GROUP BY " + groupby.join(", ") : "";
}

function writeHaving(having: Array<string>): string {
  return having.length ? " HAVING " + having.join(" AND ") : "";
}

function writeOrderBy(orderby: Array<string>): string {
  return orderby.length ? " ORDER BY " + orderby.join(", ") : "";
}

function writeLimit(limit: string): string {
  return limit.length ? " LIMIT " + limit : "";
}

function writeOffset(offset: string): string {
  return offset.length ? " OFFSET " + offset : "";
}
