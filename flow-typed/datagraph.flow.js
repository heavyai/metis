// @flow
declare type Connector = {
  query: () => Promise<Array<any>>,
  tables: Array<string>
};

declare type DataState = {|
  type: "data",
  source: string | Array<SourceTransform | DataState>,
  name: string,
  transform: Array<Transform>
|};

declare type GraphContext = {
  connector: Connector,
  state: GraphState
};

declare type GraphState = {
  [string]: DataState
};

declare type Graph = {
  getState: () => GraphState,
  nodes: () => Array<DataNode>,
  data: (state: DataState) => DataNode
};

declare type DataNode = {
  getState: () => DataState,
  transform: (transform: Transform | Array<Transform> | Function) => DataNode,
  toSQL: () => string,
  values: () => Promise<Array<any>>
};

declare type SQL = {|
  select: Array<string>,
  from: string,
  where: Array<string>,
  groupby: Array<string>,
  having: Array<string>,
  orderby: Array<string>,
  limit: string,
  offset: string
|};
