import Parser from "./create-parser";

var AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
};

export default function parseAggregate(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Parser;

  if (Array.isArray(transform.groupby)) {
    transform.groupby.forEach(function (group) {
      sql = parseGroupBy(sql, group, parser);
    });
  } else {
    sql = parseGroupBy(sql, transform.groupby, parser);
  }

  transform.fields.forEach(function (field, index) {
    var as = transform.as[index];
    sql.select.push(aggregateField(transform.ops[index], field, as));
  });

  return sql;
}

function aggregateField(op, field, as) {
  var str = "";
  if (op === null) {
    str += field;
  } else if (AGGREGATES[op]) {
    str += AGGREGATES[op] + "(" + field + ")";
  } else {
    str += op + "(" + field + ")";
  }

  return str + ("" + (as ? " as " + as : ""));
}

function parseGroupBy(sql, groupby, parser) {
  if (typeof groupby === "string") {
    sql.select.push(groupby);
    sql.groupby.push(groupby);
  } else if (groupby.type === "bin") {
    sql = parser.parseTransform(sql, groupby);
    sql.groupby.push(groupby.as);
  } else if (groupby.type === "project") {
    sql.select.push(parser.parseExpression(groupby.expr) + (groupby.as ? " as " + groupby.as : ""));
    if (groupby.as) {
      sql.groupby.push(groupby.as);
    }
  }
  return sql;
}