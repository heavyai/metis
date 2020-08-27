// @flow
import type { SQL } from "./write-sql";

export default function sample(sql: SQL, transform: Sample): SQL {
  const { size, limit } = transform;
  const ratio = Math.min(limit / size, 1.0);

  if (transform.method === "multiplicativeRowid" && ratio < 1) {
    sql.where.push(
      `(SAMPLE_RATIO(${ratio}) OR (${transform.field} IN (${transform.expr.map(e => typeof e === "string" ? `'${e}'` : `${e}`).join(", ")})))`
    );
  } else if (transform.method === "multiplicative" && ratio < 1) {
    // We are using simple modulo arithmetic expression conversion, 
    // (A * B) mod C = (A mod C * B mod C) mod C, 
    // to optimize the filter here. This helps  the overflow on the backend.
    // We don't have the full modulo expression for golden ratio since 
    // that is a constant expression and we can avoid that execution
    sql.where.push(
      `SAMPLE_RATIO(${ratio})`
    );
  }

  return sql;
}
