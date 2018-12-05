// @flow
import type { ExtractUnits, DateTruncUnits } from "./expression-type";
import type { DataState } from "../create-data-node";

declare type Expression =
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

declare type BooleanExpression =
  | ComparisonExpression
  | LogicalExpression
  | ConditionalExpression
  | InExpression;

declare type LogicalExpression = NotExpression | AndExpression | OrExpression;

declare type NotExpression = {|
  type: "not",
  expr: string | BooleanExpression
|};

declare type AndExpression = {|
  type: "and",
  left: string | BooleanExpression,
  right: string | BooleanExpression
|};

declare type OrExpression = {|
  type: "or",
  left: string | BooleanExpression,
  right: string | BooleanExpression
|};

declare type ComparisonExpression =
  | ComparisonOperatorExpression
  | BetweenExpression
  | NullExpression;

declare type ComparisonOperatorExpression = {|
  type: "=" | "<>" | "<" | ">" | "<=" | ">=",
  left: string | number,
  right: string | number
|};

declare type BetweenExpression = {|
  type: "between" | "not between",
  field: string,
  left: number | string,
  right: number | string
|};

declare type NullExpression = {|
  type: "is null" | "is not null",
  field: string
|};

declare type PatternMatchingExpression = {|
  type: "like" | "not like" | "ilike",
  left: string,
  right: string
|};

declare type InExpression = {|
  type: "in" | "not in",
  expr: string,
  set: string | DataState | Array<string | number>
|};

declare type ConditionalExpression = CaseExpression | CoalesceExpression;

declare type CoalesceExpression = {|
  type: "coalesce",
  values: Array<string>
|};

declare type CaseExpression = {|
  type: "case",
  cond: Array<[BooleanExpression | string, string]>,
  else: string
|};

declare type CastExpresssion = {|
  type: "cast",
  expr: string,
  as: string
|};

declare type StatisticalFunctionExpression =
  | StatisticalValueFunction
  | StatisticalPairFunction;

declare type StatisticalValueFunction = {|
  type: "stddev" | "stddev_pop" | "stddev_samp" | "var_pop" | "var_samp",
  x: string
|};

declare type StatisticalPairFunction = {|
  type: "corr" | "covar_pop" | "covar_samp",
  x: string,
  y: string
|};

declare type AggregateFunctionExpression =
  | MaxExpression
  | MinExpression
  | SumExpression
  | AvgExpression
  | SampleExpression
  | CountExpression;

declare type MaxExpression = {|
  type: "max",
  field: string,
  as?: string
|};

declare type MinExpression = {|
  type: "min",
  field: string,
  as?: string
|};

declare type SumExpression = {|
  type: "sum",
  field: string,
  as?: string
|};

declare type AvgExpression = {|
  type: "average",
  field: string,
  as?: string
|};

declare type SampleExpression = {|
  type: "sample",
  field: string,
  as?: string
|};

declare type CountExpression = {|
  type: "count",
  distinct: boolean,
  approx: boolean,
  field: string,
  as?: string
|};

declare type TimeFunctionExpression = DateTruncExpression | ExtractExpression;

declare type DateTruncExpression = {
  type: "date_trunc",
  unit: DateTruncUnits,
  field: string
};

declare type ExtractExpression = {
  type: "extract",
  unit: ExtractUnits,
  field: string
};

declare type AliasExpression = {
  expr: string | Expression,
  as: string
};
