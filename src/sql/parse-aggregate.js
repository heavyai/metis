// @flow
const AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
};

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
    sql.groupby = sql.groupby.concat(transform.groupby);
  }

  return sql;
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
