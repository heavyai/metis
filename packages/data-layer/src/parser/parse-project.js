// @flow
import defaultParser from "./create-parser";
import type { SQL } from "./write-sql";
import type { Parser } from "./create-parser";

export default function parseProject(
  sql: SQL,
  transform: Project,
  parser: any = defaultParser
): SQL {
  sql.select.push(
    parser.parseExpression(transform.expr) +
      (transform.as ? " as " + transform.as : "")
  );
  return sql;
}
