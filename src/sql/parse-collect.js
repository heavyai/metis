// @flow
const ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
}

function orderField (ordering, field) {
  const order = ordering ? " " + ORDERINGS[ordering] : ""
  return field + order
}

export default function parseCollect (sql: SQL, {sort, limit}: Collect): SQL {
  if (sort) {
    if (typeof sort.field === "string") {
      sql.orderby.push(orderField(sort.order, sort.field))
    } else if (Array.isArray(sort.field)) {
      sort.order.forEach((ordering, index) => {
        sql.orderby.push(orderField(ordering, sort.field[index]))
      })
    }
  } else if (limit) {
    sql.limit += limit.row,
    sql.offset += limit.offset || sql.offset
  }

  return sql
}
