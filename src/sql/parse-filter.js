// @flow

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

export default function parseFilter(sql: SQL, transform: Filter): SQL {
  switch (transform.type) {
    case "filter":
      sql.where.push("(" + transform.expr + ")");
      return sql;
    case "filter.range":
      return parseFilterRange(sql, transform);
    case "filter.exact":
      return parseFilterExact(sql, transform);
    default:
      return sql;
  }
}
