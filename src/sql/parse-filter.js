// @flow
export default function parseFilter (sql: SQL, transform: Transform): SQL {
  sql.where.push("(" + transform.expr + ")")
  return sql
}
