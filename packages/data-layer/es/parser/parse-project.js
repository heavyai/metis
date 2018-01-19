import defaultParser from "./create-parser";


export default function parseProject(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultParser;

  sql.select.push(parser.parseExpression(transform.expr) + (transform.as ? " as " + transform.as : ""));
  return sql;
}