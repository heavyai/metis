// @flow
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
import type { DataState } from "../create-data-node";

/**
 * Creates an alias expression
 * @memberof Expression
 */
export function alias(as: string, expr: string | Expression): AliasExpression {
  return {
    expr,
    as
  };
}

/**
 * Creates an average expression
 * @memberof Expression
 */
export function avg(alias: string, field: string): AvgExpression {
  return {
    type: "average",
    field,
    as: alias
  };
}

/**
 * creates a min expression
 * @memberof Expression
 */
export function min(alias: string, field: string): MinExpression {
  return {
    type: "min",
    field,
    as: alias
  };
}

/**
 * creates a max expression
 * @memberof Expression
 */
export function max(alias: string, field: string): MaxExpression {
  return {
    type: "max",
    field,
    as: alias
  };
}

/**
 * creates a sum expression
 * @memberof Expression
 */
export function sum(alias: string, field: string): SumExpression {
  return {
    type: "sum",
    field,
    as: alias
  };
}

/**
 * creates a count expression
 * @memberof Expression
 */
export function count(
  distinct: boolean,
  alias: string,
  field: string
): CountExpression {
  return {
    type: "count",
    distinct,
    approx: false,
    field,
    as: alias
  };
}

/**
 * creates an approx count expression
 * @memberof Expression
 */
export function approxCount(
  distinct: boolean,
  alias: string,
  field: string
): CountExpression {
  return {
    type: "count",
    distinct,
    approx: true,
    field,
    as: alias
  };
}

/**
 * creates a count star expression
 * @memberof Expression
 */
export function countStar(alias: string): CountExpression {
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
export function extract(unit: ExtractUnits, field: string): ExtractExpression {
  return {
    type: "extract",
    unit,
    field
  };
}

/**
 * creates a date_trunc function expression
 * @memberof Expression
 */
export function dateTrunc(
  unit: DateTruncUnits,
  field: string
): DateTruncExpression {
  return {
    type: "date_trunc",
    unit,
    field
  };
}

/**
 * creates an in expression
 * @memberof Expression
 */
export function inExpr(
  expr: string,
  set: string | DataState | Array<string | number>
) {
  return {
    type: "in",
    expr,
    set
  };
}

/**
 * Creates a not expression
 * @memberof Expression
 */
export function not(expr: string | BooleanExpression): NotExpression {
  return {
    type: "not",
    expr
  };
}

/**
 * Creates a case expression
 * @memberof Expression
 */
export function caseExpr(
  cond: Array<[BooleanExpression | string, string]>,
  end: string
): CaseExpression {
  return {
    type: "case",
    cond,
    else: end
  };
}

/**
 * Creates a between expression
 * @memberof Expression
 */
export function between(
  field: string,
  range: Array<number | string>
): BetweenExpression {
  return {
    type: "between",
    field,
    left: range[0],
    right: range[1]
  };
}
