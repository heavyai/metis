// @flow
import createDataNode from "./data-node"
import invariant from "invariant"

export function createDataGraph (connector: Connector, initialState: GraphState = {}): Graph {
  invariant(
    typeof connector.query === "function",
    "invalid connector"
  )

  const context = {
    state: initialState,
    connector
  }

  const nodes = []

  return {
    nodes () {
      return nodes
    },
    getState () {
      return context.state
    },
    data (state) {
      const dataNode = createDataNode(context, state)
      context.state[state.name] = dataNode.getState()
      nodes.push(dataNode)
      return dataNode
    }
  }
}
