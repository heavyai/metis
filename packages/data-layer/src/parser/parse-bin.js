// @flow
import type { SQL } from "./write-sql";

export default function parseBin(
  sql: SQL,
  { field, as, extent, maxbins }: Bin
): SQL {

  // numBins is used conditionally in our query building below.
  // first of all, if we're going to fall into the overflow bin AND we have
  // 0 bins, then we should land in bin 0. Otherwise, we should land in the last
  // bin.
  //
  // later, we calculate the binning magic number based on numBins - dividing either
  // by it or 1 if it doesn't exist, to prevent a divide by zero / infinity error.
  //
  // The logic used by mapd-crossfilter's getBinnedDimExpression is completely different.
  const numBins  = extent[1] - extent[0];

  sql.select.push(
    `case when
      ${field} >= ${extent[1]}
    then
      ${ numBins === 0 ? 0 : maxbins - 1}
    else
      cast((cast(${field} as float) - ${extent[0]}) * ${maxbins /
      (numBins || 1) } as int)
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
