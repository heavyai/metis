"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alias = alias;
exports.avg = avg;
exports.min = min;
exports.max = max;
exports.sum = sum;
exports.count = count;
exports.approxCount = approxCount;
exports.countStar = countStar;
exports.extract = extract;
exports.dateTrunc = dateTrunc;
exports.inExpr = inExpr;
exports.not = not;
exports.caseExpr = caseExpr;
exports.between = between;


/**
 * Creates an alias expression
 * @memberof Expression
 */
function alias(as, expr) {
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
function avg(alias, field) {
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
function min(alias, field) {
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
function max(alias, field) {
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
function sum(alias, field) {
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
function count(distinct, alias, field) {
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
function approxCount(distinct, alias, field) {
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
function countStar(alias) {
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
function extract(unit, field) {
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
function dateTrunc(unit, field) {
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
function inExpr(expr, set) {
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
function not(expr) {
  return {
    type: "not",
    expr: expr
  };
}

/**
 * Creates a case expression
 * @memberof Expression
 */
function caseExpr(cond, end) {
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
function between(field, range) {
  return {
    type: "between",
    field: field,
    left: range[0],
    right: range[1]
  };
}