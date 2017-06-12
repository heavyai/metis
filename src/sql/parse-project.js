import parseExpression from "./parse-expression";

export default function parseProject(sql, transform) {
  sql.select.push(
    parseExpression(transform.expr) +
      (transform.as ? " as " + transform.as : "")
  );
  return sql;
}
