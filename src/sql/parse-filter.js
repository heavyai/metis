// @flow

export default function parseFilter(sql: SQL, transform: Filter): SQL {
  switch (transform.type) {
    case "filter":
      sql.where.push("(" + transform.expr + ")");
      return sql;
    case "filter.range":
      return parseFilterRange(sql, transform);
    case "filter.exact":
      return parseFilterExact(sql, transform);
    case "filter.operation":
      return parseFilterOperation(sql, transform);
    default:
      return sql;
  }
}

function parseFilterExact(sql: SQL, transform: FilterExact): SQL {
  if (typeof transform.equals === "string") {
    sql.where.push(
      "(" + transform.field + " = " + "'" + transform.equals + "'" + ")"
    );
  } else if (Array.isArray(transform.equals) && transform.equals.length) {
    const stmt = transform.equals
      .map(equal => transform.field + " = " + "'" + equal + "'")
      .join(" OR ");

    sql.where.push("(" + stmt + ")");
  }
  return sql;
}

function parseFilterRange(sql: SQL, transform: FilterRange): SQL {
  sql.where.push(
    "(" +
      transform.field +
      " >= " +
      transform.range[0] +
      " AND " +
      transform.field +
      " <= " +
      transform.range[1] +
      ")"
  );

  return sql;
}

function parseFilterOperation(sql: SQL, transform: FilterOperation): SQL {
  if (Array.isArray(transform.filters)) {
    const filters = transform.filters
      .map(filter => {
        if (Array.isArray(filter)) {
          return "(" + filter.map(operationExpression).join(" OR ") + ")";
        } else if (typeof filter === "object") {
          return "(" + operationExpression(filter) + ")";
        } else {
          return "";
        }
      })
      .join(" AND ");

    sql.where.push("(" + filters + ")");
  } else if (typeof transform.filters === "object") {
    sql.where.push(operationExpression(transform.filters));
  }

  return sql;
}

function operationExpression(operation: OperationExpression): string {
  switch (operation.type) {
    case "=":
    case "<>":
    case "<":
    case "<=":
    case ">":
    case ">=":
      const operatonExpr =
        operation.left +
        " " +
        operation.type +
        " " +
        `${typeof operation.right === "string" ? "'" : ""}` +
        operation.right +
        `${typeof operation.right === "string" ? "'" : ""}`;
      return operation.not ? "NOT(" + operatonExpr + ")" : operatonExpr;
    case "ilike":
    case "like":
      const comparisonExpr =
        operation.left +
        " " +
        operation.type.toUpperCase() +
        " " +
        '%"' +
        operation.right +
        '"%';
      return operation.not ? "NOT(" + comparisonExpr + ")" : comparisonExpr;
    case "between":
      return "BETWEEN " + operation.right + " AND " + operation.left;
    default:
      return "";
  }
}
