// @flow
import { toExpression } from "./parse-formula";

const AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
};

function isFormula(transform: Formula): boolean {
  if (typeof transform !== "object") {
    return false;
  } else if (
    transform.hasOwnProperty("type") &&
    (transform.type === "formula" ||
      transform.type === "formula.date_trunc" ||
      transform.type === "formula.extract")
  ) {
    return true;
  } else {
    return false;
  }
}

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
    transform.groupby.forEach((group: string | Formula) => {
      if (typeof group === "string") {
        sql.groupby.push(group);
      } else if (isFormula(group)) {
        sql.select.push(toExpression(group));
        sql.groupby.push(group.as);
      }
    });
  } else if (
    typeof transform.groupby === "object" &&
    isFormula(transform.groupby)
  ) {
    sql.select.push(toExpression(transform.groupby));
    if (
      !Array.isArray(transform.groupby) &&
      typeof transform.groupby === "object" &&
      transform.groupby.hasOwnProperty("as")
    ) {
      sql.groupby.push(transform.groupby.as);
    }
  }

  return sql;
}
