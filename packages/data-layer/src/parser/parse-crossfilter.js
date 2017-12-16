// @flow
import Parser from "./create-parser";
import parseFilter from "./parse-filter";

import type { SQL } from "./write-sql";

export default function parseCrossfilter(
  sql: SQL,
  transform: Crossfilter,
  parser: any = Parser
): SQL {
  switch (transform.type) {
    case "crossfilter":
      if (typeof sql.unresolved === "object") {
        if (sql.unresolved.hasOwnProperty(transform.signal)) {
          Object.keys(transform.filter).forEach(key => {
            const filter = transform.filter[key];
            if (sql.unresolved) {
              const { ignore } = sql.unresolved[transform.signal];
              if (
                Array.isArray(ignore)
                  ? ignore.indexOf(key) === -1
                  : key !== ignore
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
