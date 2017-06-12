// @flow
import parseExpression from "./parse-expression";

export default function parseFilter(sql: SQL, transform: Filter): SQL {
  switch (transform.type) {
    case "filter":
      sql.where.push(
        "(" +
          (typeof transform.expr === "object"
            ? parseExpression(transform.expr)
            : transform.expr) +
          ")"
      );
    default:
      return sql;
  }
}
