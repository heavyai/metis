import type { SQL } from "./write-sql";

const operator = {
  "greater than or equals": ">=",
  "less than or equals": "<=",
  "equals": "=",
  "not equals": "<>"
}

function comparisonOperator(ops, min, max) {
  switch (ops) {
    case ">=":
    case "=":
    case "<>":
      return `${ops} ${min}`
    case "<=":
      return `${ops} ${max}`
    default:
      return ""
  }
}

export default function parsePostFilter(
  sql: SQL,
  transform: Filter
): SQL {
  switch (transform.type) {
    case "postFilter":
      let operatorExpr;
      if (transform.ops === "between" || transform.ops === "not between") {
        operatorExpr = `${transform.ops} ${transform.min} AND ${transform.max}`
      } else if (transform.ops === "null" || transform.ops === "not null") {
        operatorExpr = `is ${transform.ops}`
      } else {
        operatorExpr = comparisonOperator(operator[transform.ops], transform.min, transform.max)
      }
      let expr =transform.custom ? `${transform.fields[0]} ${operatorExpr}` : `${transform.aggType}(${transform.fields[0]}) ${operatorExpr}`
      sql.having.push(expr);
    default:
      return sql;
  }
}