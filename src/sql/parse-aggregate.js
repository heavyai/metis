// @flow
import parseExpression from "./parse-expression";

const AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
};

function aggregateField(op, field, as) {
  let str = "";
  if (op === null) {
    str += field;
  } else if (AGGREGATES[op]) {
    str += AGGREGATES[op] + "(" + field + ")";
  }
  return str + `${as ? " as " + as : ""}`;
}

export default function parseAggregate(sql: SQL, transform: Aggregate): SQL {
  transform.fields.forEach((field: string, index: number): void => {
    const as = Array.isArray(transform.as) ? transform.as[index] : null;
    if (Array.isArray(transform.ops)) {
      sql.select.push(aggregateField(transform.ops[index], field, as));
    } else {
      sql.select.push(aggregateField(null, field, as));
    }
  });

  if (typeof transform.groupby === "string") {
    sql.groupby.push(transform.groupby);
  } else if (Array.isArray(transform.groupby)) {
    transform.groupby.forEach((group: string | Project) => {
      if (typeof group === "string") {
        sql.groupby.push(group);
      } else if (group.type === "project") {
        sql.select.push(
          parseExpression(group.expr) + (group.as ? " as " + group.as : "")
        );
        if (group.as) {
          sql.groupby.push(group.as);
        }
      }
    });
  } else if (
    typeof transform.groupby === "object" &&
    transform.groupby.type === "project"
  ) {
    sql.select.push(
      parseExpression(transform.groupby.expr) +
        (typeof transform.groupby === "object" && transform.groupby.as
          ? // $FlowFixMe
            " as " + transform.groupby.as
          : "")
    );
    if (
      !Array.isArray(transform.groupby) &&
      typeof transform.groupby === "object" &&
      transform.groupby.as
    ) {
      sql.groupby.push(transform.groupby.as);
    }
  }

  return sql;
}
