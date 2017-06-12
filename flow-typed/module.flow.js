declare module "mapd-data-layer" {
  declare export function writeSQL(state: DataState): string
  declare export function createDataGraph(connector: Connector, initialState: GraphState): Graph
}
