// @flow
declare type Connector = {
  query: () => Promise<Array<any>>,
  tables: Array<string>
}

declare type DataState = {
  source: string,
  name?: string,
  transform: Array<Transform>
}

declare type GraphContext = {
  connector: Connector,
  state: GraphState
}

declare type GraphState = {
  [string]: DataState
}

declare type Graph = {
  getState: () => GraphState,
  nodes: () => Array<DataNode>,
  data: (state: DataState) => DataNode
}

declare type DataNode = {
  getState: () => DataState,
  transform: (transform: Transform | Array<Transform>) => DataNode,
  toSQL: () => string,
  values: () => Promise<Array<any>>
}

declare type Transform = Aggregate | Bin | Collect | Filter | Formula | Sample | Crossfilter | ResolveFilter

declare type Aggregate = {
  type: "aggregate",
  fields?: Array<string> | string,
  ops?: "average" | "count" | "min" | "max" | "sum",
  as?: Array<string> | string,
  groupby?: Array<string> | string,
  expr?: string
}

declare type Bin = {
  type: "bin",
  field: string,
  extent: Array<number>,
  step?: number,
  maxbins?: number,
  as?: string 
}

declare type Collect = Sort | Limit

type Limit = {
  type: "collect",
  limit: {
    row: number,
    offset?: number
  }
}

type SortOrder = "ascending" | "descending"
type Sort = {
  type: "collect",
  sort: {
    field: Array<string> | string,
    order: Array<SortOrder> | SortOrder
  }
}

declare type Filter = {
  type: "filter",
  id: string | number,
  expr: string,
}

declare type Formula = FormulaExpression | FormulaOperation

type FormulaExpression = {
  type: "formula",
  expr: string,
  as: string
}

type DateTrunc = {
  type: "date_trunc",
  field: string,
  unit: "decade" | "year" | "quarter" | "month" | "week" | "day" | "hour"
}

type Extract = {
  type: "extract",
  field: string,
  unit: "year" | "quarter" | "month" | "dom" | "dow" | "hour" | "minute"
}

type FormulaOperation = {
  type: "formula",
  op: DateTrunc | Extract,
  as: string
}

declare type Sample = {
  type: "sample",
  size: number
}

declare type Crossfilter = {
  type: "crossfilter",
  signal: string,
  filter: Array<Filter>
}

declare type ResolveFilter = {
  type: "resolveFilter",
  filter: {signal: string},
  ignore?: Array<string> | string
}
