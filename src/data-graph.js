// @flow
import createDataNode from "./data-node";
import { createParser } from "./sql/parser";
import invariant from "invariant";

/**
 * Creates a SQL data graph instance.
* @memberof API
 */
export function createDataGraph(
  connector: Connector,
  initialState: GraphState = {}
): Graph {
  invariant(typeof connector.query === "function", "invalid connector");

  const context = {
    state: initialState,
    connector,
    parser: createParser()
  };

  const nodes = [];

  /**
   * An instance of a SQL data graph
   * @namespace Graph
   */
  return {
    /**
     * Returns all data node instances of the graph.
     * @memberof Graph
     * @inner
     */
    nodes(): Array<DataNode> {
      return nodes;
    },
    /**
     * Returns the state of the graph.
     * @memberof Graph
     * @inner
     */
    getState(): GraphState {
      return context.state;
    },
    /**
     * Creates a data node instance.
     * @memberof Graph
     * @inner
     */
    data(state: DataState): DataNode {
      const dataNode: DataNode = createDataNode(context, state);
      context.state[state.name] = dataNode.getState();
      nodes.push(dataNode);
      return dataNode;
    }
  };
}
