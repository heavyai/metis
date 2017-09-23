// @flow
import type { Expression } from "./expression-type";

declare type Transform =
  | Aggregate
  | Bin
  | Sort
  | Limit
  | Filter
  | Project
  | Sample
  | Crossfilter
  | ResolveFilter;

declare type SourceTransform = Scan | Join;

declare type JoinRelation = "join" | "join.inner" | "join.left" | "join.right";

type SortOrder = "ascending" | "descending";
declare type ExtractUnits =
  | "year"
  | "quarter"
  | "month"
  | "dom"
  | "dow"
  | "hour"
  | "minute";
declare type DateTruncUnits =
  | "decade"
  | "year"
  | "quarter"
  | "month"
  | "week"
  | "day"
  | "hour";
type Aggregation = "average" | "count" | "min" | "max" | "sum";

declare type Aggregate = {|
  type: "aggregate",
  fields: Array<string>,
  ops: Array<Aggregation>,
  as: Array<string>,
  groupby: Array<string | Project | Bin> | string | Project | Bin
|};

declare type Bin = {|
  type: "bin",
  field: string,
  extent: Array<number>,
  maxbins: number,
  as: string
|};

declare type Limit = {
  type: "limit",
  row: number,
  offset?: number
};

declare type Sort = {|
  type: "sort",
  field: Array<string>,
  order?: Array<SortOrder>
|};

declare type Filter = {|
  type: "filter",
  id: string | number,
  expr: string | Expression | Array<string | Expression>
|};

declare type Project = {|
  type: "project",
  expr: string | Expression,
  as?: string
|};

declare type Join = {|
  type: JoinRelation,
  on?: Filter | Array<Filter>,
  as?: string
|};

declare type Sample = {
  type: "sample",
  method: "multiplicative",
  size: number,
  limit: number
};

declare type Scan = {|
  type: "scan",
  table: string
|};

declare type Crossfilter = {|
  type: "crossfilter",
  signal: string,
  filter: { [string]: Filter }
|};

declare type ResolveFilter = {|
  type: "resolvefilter",
  filter: { signal: string },
  ignore?: Array<string | number> | string | number
|};
