// @flow
import type { DataState } from "../create-data-node";
import type { Parser } from "./create-parser";
import type { SQL } from "./write-sql";

export default function parseDataState(
  state: DataState,
  parser: Parser,
  initialSQL?: SQL = {
    select: [],
    from: "",
    where: [],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: "",
    unresolved: {}
  }
): SQL {
  return state.transform.reduce(
    (sql: SQL, t: Transform): SQL => parser.parseTransform(sql, t),
    {
      select: initialSQL.select,
      from: state.type === "root"
        ? typeof state.source === "string"
            ? state.source
            : parser.parseSource(state.source)
        : initialSQL.from,
      where: initialSQL.where,
      groupby: initialSQL.groupby,
      having: initialSQL.having,
      orderby: initialSQL.orderby,
      limit: initialSQL.limit,
      offset: initialSQL.offset,
      unresolved: initialSQL.unresolved
    }
  );
}
