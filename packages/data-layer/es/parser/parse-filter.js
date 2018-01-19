var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import Parser from "./create-parser";


export default function parseFilter(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Parser;

  switch (transform.type) {
    case "filter":
      sql.where.push("(" + (_typeof(transform.expr) === "object" ? parser.parseExpression(transform.expr) : transform.expr) + ")");
    default:
      return sql;
  }
}