// @flow
import Parser from "./parser";
import parseFilter from "./parse-filter";

export default function parseCrossfilter(
  sql: SQL,
  transform: Crossfilter,
  parser: any = Parser
): SQL {
  switch (transform.type) {
    case "crossfilter":
      if (typeof sql.unresolved === "object") {
        if (sql.unresolved.hasOwnProperty(transform.signal)) {
          transform.filter.forEach(filter => {
            if (sql.unresolved) {
              const { ignore } = sql.unresolved[transform.signal];
              if (
                Array.isArray(ignore)
                  ? ignore.indexOf(filter.id) === -1
                  : filter.id !== ignore
              ) {
                parseFilter(sql, filter, parser);
              }
            }
          });
        }
      }
    default:
      return sql;
  }
}
