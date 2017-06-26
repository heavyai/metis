// @flow
import type {DataState} from "../create-data-node"

export function alias (as: string, expr: string | Expression): AliasExpression {
  return {
    expr,
    as
  }
}

export function avg (alias: string, field: string): AvgExpression {
  return {
    type: "average",
    field,
    as: alias
  }
}

export function min (alias: string, field: string): MinExpression {
  return {
    type: "min",
    field,
    as: alias
  }
}

export function max (alias: string, field: string): MaxExpression {
  return {
    type: "max",
    field,
    as: alias
  }
}

export function sum (alias: string, field: string): SumExpression {
  return {
    type: "sum",
    field,
    as: alias
  }
}

export function count (distinct: boolean, alias: string, field: string): CountExpression {
  return {
    type: "count",
    distinct,
    approx: false,
    field,
    as: alias
  }
}

export function approxCount (distinct: boolean, alias: string, field: string): CountExpression {
  return {
    type: "count",
    distinct,
    approx: true,
    field,
    as: alias
  }
}

export function countStar (alias: string): CountExpression {
  return {
    type: "count",
    distinct: false,
    approx: false,
    field: "*",
    as: alias
  }
}

export function extract (unit: ExtractUnits, field: string): ExtractExpression {
  return {
    type: "extract",
    unit,
    field,
  }
}

export function dateTrunc (unit: DateTruncUnits, field: string): DateTruncExpression {
  return {
    type: "date_trunc",
    unit,
    field
  }
}

export function inExpr (expr: string, set: string | DataState | Array<string | number>) {
  return {
    type: "in",
    expr,
    set
  }
}

export function not (expr: string | BooleanExpression): NotExpression {
  return {
    type: "not",
    expr
  }
}

export function caseExpr (cond: Array<[BooleanExpression | string, string]>, end: string): CaseExpression {
  return {
    type: "case",
    cond,
    else: end
  }
}

export function between (field: string, range: Array<number | string>): BetweenExpression {
  return {
    type: "between",
    field,
    left: range[0],
    right: range[1]
  }
}
