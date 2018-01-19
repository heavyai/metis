var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import Parser from "./create-parser";
import parseFilter from "./parse-filter";

export default function parseCrossfilter(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Parser;

  switch (transform.type) {
    case "crossfilter":
      if (_typeof(sql.unresolved) === "object") {
        if (sql.unresolved.hasOwnProperty(transform.signal)) {
          Object.keys(transform.filter).forEach(function (key) {
            var filter = transform.filter[key];
            if (sql.unresolved) {
              var ignore = sql.unresolved[transform.signal].ignore;

              if (Array.isArray(ignore) ? ignore.indexOf(key) === -1 : key !== ignore) {
                parseFilter(sql, filter, parser);
              }
            }
          });
        }
      }
    default:
      return sql;
  }
}