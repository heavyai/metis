// @flow
const ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
};

function parseSort(sql: SQL, transform: CollectSort) {
  transform.sort.field.forEach((field, index) => {
    sql.orderby.push(
      field +
        (Array.isArray(transform.sort.order)
          ? " " + ORDERINGS[transform.sort.order[index]]
          : "")
    );
  });
  return sql;
}

export default function parseCollect(sql: SQL, transform: Collect): SQL {
  switch (transform.type) {
    case "collect.sort":
      return parseSort(sql, transform);
    case "collect.limit":
      sql.limit += transform.limit.row;
      sql.offset += transform.limit.offset || sql.offset;
      return sql;
    default:
      return sql;
  }
}
