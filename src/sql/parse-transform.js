// @flow
const AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
}

const ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
}

export default function parse (transforms: Array<Transform>): SQL {
  const initialSQL = {
    select: [],
    from: "",
    where: [],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: ""
  }

  return transforms.reduce((sql: SQL, transform: Transform): SQL => {
    switch (transform.type) {
      case "aggregate":
        return aggregate(sql, transform)
      case "bin":
        return bin(sql, transform)
      case "collect":
        return collect(sql, transform)
      case "filter":
        return filter(sql, transform)
      case "formula":
        return formula(sql, transform)
      case "sample":
        return sample(sql, transform)
      default:
        return sql
    }
  }, initialSQL)
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

export function aggregate (sql: SQL, {fields, ops, as, groupby}: Aggregate): SQL {
  if (typeof fields === "string") {
    sql.select.push(aggregateField(ops, fields, as))
  } else if (Array.isArray(fields)) {
    as = as || []
    ops.forEach((operation, index) => {
      sql.select.push(aggregateField(operation, fields[index], as[index]))
    })
  }

  if (typeof groupby === "string") {
    sql.groupby.push(groupby)
  } else if (Array.isArray(groupby)) {
    sql.groupby = sql.groupby.concat(groupby)
  }

  return sql
}

export function bin (sql: SQL, {field, as, extent, maxbins}: Bin): SQL {
  sql.select.push(`cast((cast(${field} as float) - 0) * ${maxbins / (extent[1] - extent[0])} as int) as ${as}`)
  sql.where.push(`((${field} >= ${extent[0]} AND ${field} <= ${extent[1]}) OR (${field} IS NULL))`)
  sql.having.push(`(${as} >= 0 AND ${as} < ${maxbins} OR ${as} IS NULL)`)
  return sql
}

function orderField (ordering, field) {
  const order = ordering ? " " + ORDERINGS[ordering] : ""
  return field + order
}

export function collect (sql: SQL, {sort, limit}: Collect): SQL {
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

export function filter (sql: SQL, transform: Transform): SQL {
  sql.where.push(transform.expr)
  return sql
}

export function formula (sql: SQL, transform: Formula): SQL {
  return sql
}

export function sample (sql: SQL, transform: Sample): SQL {
  return sql
}
