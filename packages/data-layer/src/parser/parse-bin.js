// @flow
import type { SQL } from "./write-sql";

export default function parseBin(
  sql: SQL,
  { field, as, extent, maxbins }: Bin
): SQL {
  if (extent[0] >= extent[1]) {
    // Why "1 - 1"? There is a bug in calcite that will throw an error if you
    // try to SELECT a constant integer with a group by clause. This gets
    // around it by returning an expression ¯\_(ツ)_/¯
    sql.select.push(`1 - 1 AS ${as}`);
  } else {
    sql.select.push(`CASE WHEN ${field} >= ${extent[1]} THEN ${maxbins} ELSE WIDTH_BUCKET(${field}, ${extent[0]}, ${extent[1]}, ${maxbins}) END - 1 AS ${as}`);
  }

  sql.where.push(`((${field} >= ${extent[0]} AND ${field} <= ${extent[1]}) OR (${field} IS NULL))`);

  sql.having.push(`(${as} >= 0 AND ${as} < ${maxbins} OR ${as} IS NULL)`);

  return sql;
}
