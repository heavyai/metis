// @flow
import type { SQL } from "./write-sql";

// This value is just about the smallest that can be meaningfully represented by a
// 32-bit float, and provides a bound around possible roundoff errors
const FLOAT_EPSILON = Math.pow(2, -23)

export default function parseBin(
  sql: SQL,
  { field, as, extent: [start, end], maxbins }: Bin
): SQL {
  // Including FLOAT_EPSILON in these calculations effectively adds a tiny extra range
  // FLOAT_EPSILON wide on the start and end of the extent, for two reasons:
  // 1) Account for possible roundoff errors that occurred when retrieving them initially, and
  // 2) Include the maximum value that is exactly `end`, where it would otherwise fall off the top bin
  const inputRange = end - start + 2 * FLOAT_EPSILON
  const binRange = maxbins - FLOAT_EPSILON
  const stretchFactor = binRange / inputRange
  const shiftAmount = -(FLOAT_EPSILON * binRange) / inputRange

  sql.select.push(
    `cast((cast(${field} as float) - ${start}) * ${stretchFactor} + ${shiftAmount} as int) as ${as}`
  );
  sql.where.push(
    `((${field} >= ${start - FLOAT_EPSILON} AND ${field} <= ${end + FLOAT_EPSILON}) OR (${field} IS NULL))`
  );
  return sql;
}
