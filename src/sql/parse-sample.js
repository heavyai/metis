// @flow
const GOLDEN_RATIO = 265445761;
const THIRTY_TWO_BITS = 4294967296;

export default function sample(sql: SQL, transform: Sample): SQL {
  /* istanbul ignore else */
  if (transform.method === "multiplicative") {
    const { size, limit } = transform;
    const ratio = Math.min(limit / size, 1.0);
    if (ratio < 1) {
      const threshold = Math.floor(THIRTY_TWO_BITS * ratio);
      sql.where.push(
        `MOD(${sql.from}.rowid * ${GOLDEN_RATIO}, ${THIRTY_TWO_BITS}) < ${threshold}`
      );
    }
  }

  return sql;
}
