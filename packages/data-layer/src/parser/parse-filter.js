// @flow
import Parser from "./create-parser";
import type { SQL } from "./write-sql";

export default function parseFilter(
  sql: SQL,
  transform: Filter,
  parser: any = Parser
): SQL {
  switch (transform.type) {
    case "filter":
      sql.where.push(
        "(" +
          (typeof transform.expr === "object"
            ? parser.parseExpression(transform.expr)
            : transform.expr) +
          ")"
      );
    default:
      return sql;
  }
}
