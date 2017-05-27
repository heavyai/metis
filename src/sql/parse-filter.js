// @flow
export default function parseFilter(sql: SQL, transform: Filter): SQL {
  if (typeof transform.expr === "string") {
    sql.where.push("(" + transform.expr + ")");
  } else if (transform.range) {
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
  } else if (transform.equals) {
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
  }
  return sql;
}
