// @flow
import invariant from "invariant";
import { reduceToSQL } from "./utils";

import type { GraphContext } from "./create-data-graph";

export type DataState = RootDataNodeState | DataNodeState;

type RootDataNodeState = {
  type: "root",
  source: string | Array<SourceTransform | DataState>,
  transform: Array<Transform>,
  children?: Array<Node>
};

type DataNodeState = {
  type: "data",
  source: DataNode,
  transform: Array<Transform>,
  children?: Array<DataNode>
};

export type InitialDataNodeState = {
  source?:
    | DataNode
    | string
    | Array<SourceTransform | DataState>
    | InitialDataNodeState,
  transform?: Array<Transform>,
  children?: Array<DataNode>
};

type SetTransform =
  | Array<Transform>
  | ((transform: Array<Transform>) => Array<Transform>);

export type DataNode = {
  getState: () => RootDataNodeState | DataNodeState,
  transform: (setter: SetTransform) => DataNode,
  toSQL: () => string,
  values: () => Promise<Array<any>>,
  data: (state: InitialDataNodeState) => DataNode
};

export default function createDataNode(
  context: GraphContext,
  initialState: InitialDataNodeState = {}
) {
  let state = {
    type: initialState.type || "data",
    source: initialState.source,
    transform: initialState.transform || [],
    children: initialState.children || []
  };

  /**
   * A node in the graph that represents a set of data transformations.
   * @namespace Data
   * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/create-data-node.js|create-data-node.js}
   */
  const dataNodeAPI = {
    getState,
    transform,
    toSQL,
    values,
    data
  };

  /**
   * Returns the state of the data node.
   * @memberof Data
   * @inner
   */
  function getState(): DataState {
    return state;
  }

  /**
   * Sets the transform state of the data node. Either takes in an array of
   * transforms or a function that takes and returns an array of transforms
   * @memberof Data
   * @inner
   */
  function transform(setter: SetTransform): DataNode {
    state.transform = typeof setter === "function"
      ? setter(state.transform)
      : setter;
    return dataNodeAPI;
  }

  /**
   * Returns the SQL string representation of the set of transforms from
   * the node instance to its source root in the graph
   * @memberof Data
   * @inner
   */
  function toSQL(): string {
    return context.parser.write(reduceToSQL(context, dataNodeAPI));
  }

  /**
   * Uses the `connector` in the graph context to execute data node's
   * SQL query representation and returns queried data as a promise.
   * @memberof Data
   * @inner
   */
  function values() {
    return context.connector.query(
      context.parser.write(reduceToSQL(context, dataNodeAPI))
    );
  }

  /**
   * Creates a data node instance and sets it as a child of the parent.
   * @memberof Data
   * @inner
   */
  function data(childState?: InitialDataNodeState): DataNode {
    const dataNode = createDataNode(context, {
      ...childState,
      source: dataNodeAPI
    });
    state.children.push(dataNode);
    return dataNode;
  }

  return dataNodeAPI;
}
