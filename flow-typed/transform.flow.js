declare type Transform =
  Aggregate |
  Bin |
  Collect |
  Filter |
  Formula |
  Sample |
  Crossfilter |
  ResolveFilter

declare type TransformType =
  "aggregate" |
  "bin" |
  "collect.sort" |
  "collect.limit" |
  "filter" |
  "filter.exact" |
  "filter.range" |
  "formula" |
  "formula.date_trunc" |
  "formula.extract" |
  "sample" |
  "crossfilter" |
  "resolvefilter"

declare type SortOrder = "ascending" | "descending"
declare type ExtractUnits = "year" | "quarter" | "month" | "dom" | "dow" | "hour" | "minute"
declare type DateTruncUnits = "decade" | "year" | "quarter" | "month" | "week" | "day" | "hour"
declare type Aggregation = "average" | "count" | "min" | "max" | "sum"

declare type Aggregate = {|
  type: "aggregate",
  fields: Array<string>,
  ops?: Array<Aggregation>,
  as?: Array<string> | string,
  groupby?: Array<string | Formula> | string | Formula,
|}

declare type Bin = {|
  type: "bin",
  field: string,
  extent: Array<number>,
  maxbins: number,
  as: string
|}

declare type Collect = CollectSort | CollectLimit

declare type CollectLimit = {
  type: "collect.limit",
  limit: {
    row: number,
    offset?: number
  }
}

declare type CollectSort = {|
  type: "collect.sort",
  sort: {
    field: Array<string>,
    order?: Array<SortOrder>
  }
|}

declare type Filter = FilterExpression | FilterExact | FilterRange

declare type FilterExpression = {|
  type: "filter",
  id: string | number,
  expr: string
|}

declare type FilterExact = {|
  type: "filter.exact",
  id: string | number,
  field: string,
  equals: string | number | Array<string | number>
|}

declare type FilterRange = {|
  type: "filter.range",
  id: string | number,
  field: string,
  range: Array<string | number>
|}

declare type Formula = FormulaExpression | FormulaDateTrunc | FormulaExtract

declare type FormulaExpression = {|
  type: "formula",
  expr: string,
  as: string
|}

declare type FormulaDateTrunc = {|
  type: "formula.date_trunc",
  field: string,
  unit: DateTruncUnits,
  as: string
|}

declare type FormulaExtract = {|
  type: "formula.extract",
  field: string,
  unit: ExtractUnits,
  as: string
|}

declare type Sample = {
  type: "sample",
  size: number
}

declare type Crossfilter = {|
  type: "crossfilter",
  signal: string,
  filter: Array<Filter>
|}

declare type ResolveFilter = {|
  type: "resolvefilter",
  filter: {signal: string},
  ignore?: Array<string | number> | string | number
|}
