export type Expression =
  | LogicalExpression
  | ComparisonExpression
  | InExpression
  | ConditionalExpression
  | CastExpresssion
  | StatisticalFunctionExpression
  | AggregateFunctionExpression
  | PatternMatchingExpression
  | TimeFunctionExpression
  | DataState;

type BooleanExpression =
  | ComparisonExpression
  | LogicalExpression
  | ConditionalExpression
  | InExpression;

type LogicalExpression = NotExpression | AndExpression | OrExpression;

type NotExpression = {|
  type: "not",
  expr: string | BooleanExpression
|};

type AndExpression = {|
  type: "and",
  left: string | BooleanExpression,
  right: string | BooleanExpression
|};

type OrExpression = {|
  type: "or",
  left: string | BooleanExpression,
  right: string | BooleanExpression
|};

type ComparisonExpression =
  | ComparisonOperatorExpression
  | BetweenExpression
  | NullExpression;

type ComparisonOperatorExpression = {|
  type: "=" | "<>" | "<" | ">" | "<=" | ">=",
  left: string | number,
  right: string | number
|};

type BetweenExpression = {|
  type: "between" | "not between",
  field: string,
  left: number | string,
  right: number | string
|};

type NullExpression = {|
  type: "is null" | "is not null",
  field: string
|};

type PatternMatchingExpression = {|
  type: "like" | "not like" | "ilike",
  left: string,
  right: string
|};

type InExpression = {|
  type: "in" | "not in",
  expr: string,
  set: string | DataState | Array<string | number>
|};

type ConditionalExpression = CaseExpression | CoalesceExpression;

type CoalesceExpression = {|
  type: "coalesce",
  values: Array<string>
|};

type CaseExpression = {|
  type: "case",
  cond: Array<[BooleanExpression | string, string]>,
  else: string
|};

type CastExpresssion = {|
  type: "cast",
  expr: string,
  as: string
|};

type StatisticalFunctionExpression =
  | StatisticalValueFunction
  | StatisticalPairFunction;

type StatisticalValueFunction = {|
  type: "stddev_pop" | "stddev_samp" | "var_pop" | "var_samp",
  x: string
|};

type StatisticalPairFunction = {|
  type: "corr" | "covar_pop" | "covar_samp",
  x: string,
  y: string
|};

type AggregateFunctionExpression =
  | {|
      type: "average" | "min" | "max" | "sum",
      field: string
    |}
  | {|
      type: "count",
      distinct: boolean,
      approx: boolean,
      field: string
    |};

type TimeFunctionExpression = DateTruncExpression | ExtractExpression;

type DateTruncExpression = {
  type: "date_trunc",
  unit: DateTruncUnits,
  field: string
};

type ExtractExpression = {
  type: "extract",
  unit: ExtractUnits,
  field: string
};
