// @flow
import Parser from "./parser";

export default function parseFilter(sql: SQL, transform: Filter, parser: any = Parser): SQL {
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
