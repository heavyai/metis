// @flow
declare type Connector = {
  query: () => Promise<Array<any>>,
  tables: Array<string>
}

declare type DataState = {
  source: string,
  name: string,
  transform: Array<{}>
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
  transform: (transform: {} | Array<{}>) => DataNode,
  toSQL: () => string,
  values: () => Promise<Array<any>>
}
