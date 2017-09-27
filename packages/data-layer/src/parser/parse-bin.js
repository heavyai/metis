// @flow
import type { SQL } from "./write-sql";

export default function parseBin(
  sql: SQL,
  { field, as, extent, maxbins }: Bin
): SQL {
  sql.select.push(
    `cast((cast(${field} as float) - ${extent[0]}) * ${maxbins / (extent[1] - extent[0])} as int) as ${as}`
  );
  sql.where.push(
    `((${field} >= ${extent[0]} AND ${field} <= ${extent[1]}) OR (${field} IS NULL))`
  );
  sql.having.push(`(${as} >= 0 AND ${as} < ${maxbins} OR ${as} IS NULL)`);
  return sql;
}
