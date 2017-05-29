// @flow
import createDataNode from "./data-node";
import invariant from "invariant";

export function createDataGraph(
  connector: Connector,
  initialState: GraphState = {}
): Graph {
  invariant(typeof connector.query === "function", "invalid connector");

  const context = {
    state: initialState,
    connector
  };

  const nodes = [];

  return {
    nodes(): Array<DataNode> {
      return nodes;
    },
    getState(): GraphState {
      return context.state;
    },
    data(state: DataState): DataNode {
      const dataNode: DataNode = createDataNode(context, state);
      context.state[state.name] = dataNode.getState();
      nodes.push(dataNode);
      return dataNode;
    }
  };
}
