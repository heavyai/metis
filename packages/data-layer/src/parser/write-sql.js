// @flow
import type { DataState } from "../create-data-node";
import type { Parser } from "./create-parser";

export type SQL = {|
  select: Array<string>,
  from: string,
  where: Array<string>,
  groupby: Array<string>,
  having: Array<string>,
  orderby: Array<string>,
  limit: string,
  offset: string,
  unresolved?: {
    [string]: ResolveFilter
  }
|};

export default function writeSQL(state: DataState, parser: Parser): string {
  return write(parser.parseDataState(state));
}

export function write(sql: SQL): string {
  return writeSelect(sql.select) +
    writeFrom(sql.from) +
    writeWhere(sql.where) +
    writeGroupby(sql.groupby) +
    writeHaving(sql.having) +
    writeOrderBy(sql.orderby) +
    writeLimit(sql.limit) +
    writeOffset(sql.offset);
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
