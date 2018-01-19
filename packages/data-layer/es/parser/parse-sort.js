

var ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
};


export default function parseSort(sql, transform) {
  transform.field.forEach(function (field, index) {
    sql.orderby.push(field + (Array.isArray(transform.order) ? " " + ORDERINGS[transform.order[index]] : ""));
  });
  return sql;
}