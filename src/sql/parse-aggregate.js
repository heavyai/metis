// @flow
const AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
}

function aggregateField (op, field, as) {
  let str = ""
  if (AGGREGATES[op]) {
    str += AGGREGATES[op] + "(" + field + ")"
  } else {
    str += field
  }
  return str + `${as ? " as " + as : ""}`
}

export default function parseAggregate (sql: SQL, {fields, ops, as, groupby}: Aggregate): SQL {
  if (typeof fields === "string") {
    sql.select.push(aggregateField(ops, fields, as))
  } else if (Array.isArray(fields)) {
    as = as || []
    if (ops) {
      ops.forEach((operation, index) => {
        sql.select.push(aggregateField(operation, fields[index], as[index]))
      })
    } else {
      fields.forEach(field => sql.select.push(field))
    }
  }

  if (typeof groupby === "string") {
    sql.groupby.push(groupby)
  } else if (Array.isArray(groupby)) {
    sql.groupby = sql.groupby.concat(groupby)
  }

  return sql
}
