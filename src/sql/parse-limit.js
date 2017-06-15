// @flow

export default function parseLimit(sql: SQL, transform: Limit): SQL {
  sql.limit += transform.row;
  sql.offset += transform.offset || sql.offset;
  return sql;
}
