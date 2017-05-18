import createDataNode from "./data-node"

export function createDataGraph (connector) {
  const context = {
    state: [],
    connector
  }

  return {
    getState () {
      return context.state
    },
    createDataOperator (initialState) {
      return createDataNode(context, initialState)
    }
  }
}
