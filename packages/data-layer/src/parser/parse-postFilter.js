import type { SQL } from "./write-sql";

const operator = {
  "greater than": ">",
  "less than": "<",
  "equals": "="
}

function comparisonOperator(ops, min, max) {
  debugger
  switch (ops) {
    case ">" || "=":
      return `${ops} ${min}`
    case "<":
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
      let expr;
      if (transform.ops === "between" || transform.ops === "not between") {
        expr = `${transform.ops} ${transform.min} AND ${transform.max}`
      } else {
        expr = comparisonOperator(operator[transform.ops], transform.min, transform.max)
      }
      sql.having.push(
        `${transform.aggType}(cast(${transform.fields[0]} as float)) ${expr}`
      );
    default:
      return sql;
  }
}