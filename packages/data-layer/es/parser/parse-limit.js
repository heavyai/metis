

export default function parseLimit(sql, transform) {
  sql.limit += transform.row;
  sql.offset += transform.offset || sql.offset;
  return sql;
}