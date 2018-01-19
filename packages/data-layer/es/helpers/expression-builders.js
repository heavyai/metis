

/**
 * Creates an alias expression
 * @memberof Expression
 */
export function alias(as, expr) {
  return {
    expr: expr,
    as: as
  };
}

/**
 * Creates an average expression
 * @memberof Expression
 */

/**
 * Expression builders. These are helper functions to create expression objects
 * @name expr
 * @memberof API
 * @see {@link Expression}
 */

/**
 * Expression builder module.
 * @name Expression
 * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/types/expression-type.js|Expression Types}
 */
export function avg(alias, field) {
  return {
    type: "average",
    field: field,
    as: alias
  };
}

/**
 * creates a min expression
 * @memberof Expression
 */
export function min(alias, field) {
  return {
    type: "min",
    field: field,
    as: alias
  };
}

/**
 * creates a max expression
 * @memberof Expression
 */
export function max(alias, field) {
  return {
    type: "max",
    field: field,
    as: alias
  };
}

/**
 * creates a sum expression
 * @memberof Expression
 */
export function sum(alias, field) {
  return {
    type: "sum",
    field: field,
    as: alias
  };
}

/**
 * creates a count expression
 * @memberof Expression
 */
export function count(distinct, alias, field) {
  return {
    type: "count",
    distinct: distinct,
    approx: false,
    field: field,
    as: alias
  };
}

/**
 * creates an approx count expression
 * @memberof Expression
 */
export function approxCount(distinct, alias, field) {
  return {
    type: "count",
    distinct: distinct,
    approx: true,
    field: field,
    as: alias
  };
}

/**
 * creates a count star expression
 * @memberof Expression
 */
export function countStar(alias) {
  return {
    type: "count",
    distinct: false,
    approx: false,
    field: "*",
    as: alias
  };
}

/**
 * creates an extract function expression
 * @memberof Expression
 */
export function extract(unit, field) {
  return {
    type: "extract",
    unit: unit,
    field: field
  };
}

/**
 * creates a date_trunc function expression
 * @memberof Expression
 */
export function dateTrunc(unit, field) {
  return {
    type: "date_trunc",
    unit: unit,
    field: field
  };
}

/**
 * creates an in expression
 * @memberof Expression
 */
export function inExpr(expr, set) {
  return {
    type: "in",
    expr: expr,
    set: set
  };
}

/**
 * Creates a not expression
 * @memberof Expression
 */
export function not(expr) {
  return {
    type: "not",
    expr: expr
  };
}

/**
 * Creates a case expression
 * @memberof Expression
 */
export function caseExpr(cond, end) {
  return {
    type: "case",
    cond: cond,
    else: end
  };
}

/**
 * Creates a between expression
 * @memberof Expression
 */
export function between(field, range) {
  return {
    type: "between",
    field: field,
    left: range[0],
    right: range[1]
  };
}