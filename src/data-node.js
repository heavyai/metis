// @flow
import { nodePathToSQL } from "./node-path-utils";
import invariant from "invariant";

export default function createDataNode(
  context: GraphContext,
  initialState: DataState
): DataNode {
  invariant(typeof initialState.name === "string", "must have name and source");

  invariant(initialState.source, "must have name and source");

  let state = {
    type: "data",
    name: initialState.name,
    source: initialState.source,
    transform: initialState.transform || []
  };

  /**
   * A node in the graph that represents a set of data transformations.
   * @namespace Data
   */
  return {
    /**
     * Returns the state of the data node.
     * @memberof Data
     * @inner
     */
    getState(): DataState {
      return state;
    },
    /**
     * Sets the transform state of the data node.
     * @memberof Data
     * @inner
     */
    transform(transform: Transform | Array<Transform> | Function): DataNode {
      if (typeof transform === "function") {
        state.transform = transform(state.transform);
      } else if (Array.isArray(transform)) {
        state.transform = state.transform.concat(transform);
      } else if (typeof transform === "object") {
        state.transform.push(transform);
      } else {
        invariant(true, "invalid transform");
      }
      return this;
    },
    /**
     * Returns the SQL string representation of the set of data transformations the node embodies.
     * @memberof Data
     * @inner
     */
    toSQL(): string {
      return nodePathToSQL(context.state, state.name);
    },
    /**
     * Executes data node's SQL query representation and returns queried data as a promise.
     * @memberof Data
     * @inner
     */
    values(): Promise<Array<any>> {
      return context.connector.query(nodePathToSQL(context.state, state.name));
    }
  };
}
