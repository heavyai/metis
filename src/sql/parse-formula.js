// @flow
export default function formula(sql: SQL, { op, expr, as }: Formula): SQL {
  if (expr) {
    sql.select.push(expr + " as " + as);
  } else if (op) {
    if (op.type === "extract") {
      sql.select.push(
        "extract(" + op.unit + " from " + op.field + ") as " + as
      );
    } else if (op.type === "date_trunc") {
      sql.select.push("date_trunc(" + op.unit + ", " + op.field + ") as " + as);
    }
  }
  return sql;
}
