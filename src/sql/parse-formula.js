// @flow

export function toExpression(formula: Formula): string {
  switch (formula.type) {
    case "formula":
      if (formula.as) {
        return formula.expr + " as " + formula.as;
      } else {
        return formula.expr;
      }
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
      /* istanbul ignore next */
      throw new Error();
  }
}

export default function formula(sql: SQL, transform: Formula): SQL {
  sql.select.push(toExpression(transform));
  return sql;
}
