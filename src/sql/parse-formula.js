// @flow
export default function formula(sql: SQL, transform: Formula): SQL {
  if (transform.type === "formula") {
    sql.select.push(transform.expr + " as " + transform.as);
  } else if (transform.type === "formula.date_trunc") {
    sql.select.push(
      "date_trunc(" +
        transform.unit +
        ", " +
        transform.field +
        ") as " +
        transform.as
    );
  } else if (transform.type === "formula.extract") {
    sql.select.push(
      "extract(" +
        transform.unit +
        " from " +
        transform.field +
        ") as " +
        transform.as
    );
  }

  return sql;
}
