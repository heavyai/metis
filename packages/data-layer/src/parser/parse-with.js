// @flow
import type { SQL } from "./write-sql";
import Parser from "./create-parser";

export default function parseWith(
  sql: SQL,
  transform: With,
  parser: any = Parser
): SQL {
  const subQuery = parser.write(parser.parseDataState(transform.fields))
  // need to pass the name for the subquery from @heavyai/charting, so including with clause in the sql as an object
  sql.with.push(
    subQuery ? {temp: transform.expr, subQuery} : ""
  );
  return sql;
}
