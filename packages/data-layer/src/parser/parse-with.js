// @flow
import type { SQL } from "./write-sql";
import Parser from "./create-parser";

export default function parseWith(
  sql: SQL,
  transform: With,
  parser: any = Parser
): SQL {
  const withClause = parser.write(parser.parseDataState(transform.fields))
  sql.with.push(
    withClause ? withClause : ""
  );
  return sql;
}