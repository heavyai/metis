// @flow
import type { SQL } from "./write-sql";
import type { ResolveFilter } from "../types/transform-type";

export default function parseResolvefilter(
  sql: SQL,
  transform: ResolveFilter
): SQL {
  switch (transform.type) {
    case "resolvefilter":
      if (typeof sql.unresolved === "object") {
        sql.unresolved[transform.filter.signal] = transform;
      } else {
        sql.unresolved = {
          [transform.filter.signal]: transform
        };
      }
    default:
      return sql;
  }
}
