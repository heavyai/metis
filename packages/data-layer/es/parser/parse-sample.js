

var GOLDEN_RATIO = 265445761;

var THIRTY_TWO_BITS = 4294967296;

export default function sample(sql, transform) {
  /* istanbul ignore else */
  if (transform.method === "multiplicative") {
    var size = transform.size,
        limit = transform.limit;

    var ratio = Math.min(limit / size, 1.0);
    if (ratio < 1) {
      var threshold = Math.floor(THIRTY_TWO_BITS * ratio);
      sql.where.push("MOD(" + sql.from + ".rowid * " + GOLDEN_RATIO + ", " + THIRTY_TWO_BITS + ") < " + threshold);
    }
  }

  return sql;
}