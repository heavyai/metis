// @flow
import Parser from "./create-parser";

import type { SQL } from "./write-sql";

const AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
};

export default function parseAggregate(
  sql: SQL,
  transform: Aggregate,
  parser: any = Parser
): SQL {
  if (Array.isArray(transform.groupby)) {
    transform.groupby.forEach((group: string | Project | Bin): void => {
      sql = parseGroupBy(sql, group, parser);
    });
  } else {
    sql = parseGroupBy(sql, transform.groupby, parser);
  }

  transform.fields.forEach((field: string, index: number): void => {
    const as = transform.as[index];
    sql.select.push(aggregateField(transform.ops[index], field, as));
  });

  return sql;
}

function aggregateField(op: string, field: string, as: string): string {
  let str = "";
  if (op === null) {
    str += field;
  } else if (AGGREGATES[op]) {
    str += AGGREGATES[op] + "(" + field + ")";
  } else {
    str += `${op}(${field})`;
  }

  return str + `${as ? " as " + as : ""}`;
}

function parseGroupBy(
  sql: SQL,
  groupby: string | Project | Bin,
  parser: any
): SQL {
  if (typeof groupby === "string") {
    sql.select.push(groupby);
    sql.groupby.push(groupby);
  } else if (groupby.type === "bin") {
    sql = parser.parseTransform(sql, groupby);
    sql.groupby.push(groupby.as);
  } else if (groupby.type === "project") {
    sql.select.push(
      parser.parseExpression(groupby.expr) +
        (groupby.as ? " as " + groupby.as : "")
    );
    if (groupby.as) {
      sql.groupby.push(groupby.as);
    }
  }
  return sql;
}
