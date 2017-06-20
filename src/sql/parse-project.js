import Parser from "./parser";

export default function parseProject(sql, transform, parser: any = Parser) {
  sql.select.push(
    parser.parseExpression(transform.expr) +
      (transform.as ? " as " + transform.as : "")
  );
  return sql;
}
