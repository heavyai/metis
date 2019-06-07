// @flow
import type { SQL } from "./write-sql";

export default function parseBin(
  sql: SQL,
  { field, as, extent, maxbins }: Bin
): SQL {
  const binRange = extent[1] - extent[0];
  
  sql.select.push(
    `case when
      ${field} >= ${extent[1]}
    then
      ${ binRange === 0 ? 0 : maxbins - 1}
    else
      cast((cast(${field} as float) - ${extent[0]}) * ${maxbins /
      (binRange || 1) } as int)
    end
    as ${as}`
  );
  sql.where.push(
    `((${field} >= ${extent[0]} AND ${field} <= ${
      extent[1]
    }) OR (${field} IS NULL))`
  );
  sql.having.push(`(${as} >= 0 AND ${as} < ${maxbins} OR ${as} IS NULL)`);
  return sql;
}
