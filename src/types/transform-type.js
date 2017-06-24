export type Transform =
  | Aggregate
  | Bin
  | Sort
  | Limit
  | Filter
  | Project
  | Sample
  | Crossfilter
  | ResolveFilter;

export type SourceTransform = Scan | Join;

export type JoinRelation = "join" | "join.inner" | "join.left" | "join.right";

type SortOrder = "ascending" | "descending";
type ExtractUnits =
  | "year"
  | "quarter"
  | "month"
  | "dom"
  | "dow"
  | "hour"
  | "minute";
type DateTruncUnits =
  | "decade"
  | "year"
  | "quarter"
  | "month"
  | "week"
  | "day"
  | "hour";
type Aggregation = "average" | "count" | "min" | "max" | "sum";

export type Aggregate = {|
  type: "aggregate",
  fields: Array<string>,
  ops?: Array<Aggregation>,
  as?: Array<string> | string,
  groupby?: Array<string | Project> | string | Project
|};

export type Bin = {|
  type: "bin",
  field: string,
  extent: Array<number>,
  maxbins: number,
  as: string
|};

export type Limit = {
  type: "limit",
  row: number,
  offset?: number
};

export type Sort = {|
  type: "sort",
  field: Array<string>,
  order?: Array<SortOrder>
|};

export type Filter = {|
  type: "filter",
  id: string | number,
  expr: string | Expression | Array<string | Expression>
|};

export type Project = {|
  type: "project",
  expr: string | Expression,
  as?: string
|};

export type Join = {|
  type: JoinRelation,
  on?: Filter | Array<Filter>,
  as?: string
|};

export type Sample = {
  type: "sample",
  method: "multiplicative",
  size: number,
  limit: number
};

export type Scan = {|
  type: "scan",
  table: string
|};

export type Crossfilter = {|
  type: "crossfilter",
  signal: string,
  filter: Array<Filter>
|};

export type ResolveFilter = {|
  type: "resolvefilter",
  filter: { signal: string },
  ignore?: Array<string | number> | string | number
|};
