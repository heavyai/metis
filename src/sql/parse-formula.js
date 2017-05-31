// @flow

export function toExpression(formula: Formula): string {
  switch (formula.type) {
    case "formula":
      return formula.expr + " as " + formula.as;
    case "formula.extract":
      return (
        "extract(" +
        formula.unit +
        " from " +
        formula.field +
        ") as " +
        formula.as
      );
    case "formula.date_trunc":
      return (
        "date_trunc(" +
        formula.unit +
        ", " +
        formula.field +
        ") as " +
        formula.as
      );
    default:
      throw new Error();
  }
}

export default function formula(sql: SQL, transform: Formula): SQL {
  sql.select.push(toExpression(transform));
  return sql;
}
