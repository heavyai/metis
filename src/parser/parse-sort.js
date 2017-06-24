// @flow
import type { SQL } from "./write-sql";
import type { Sort } from "../types/transform-type";

const ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
};

export default function parseSort(sql: SQL, transform: Sort) {
  transform.field.forEach((field, index) => {
    sql.orderby.push(
      field +
        (Array.isArray(transform.order)
          ? " " + ORDERINGS[transform.order[index]]
          : "")
    );
  });
  return sql;
}
