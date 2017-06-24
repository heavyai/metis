// @flow
import invariant from "invariant";
import { reduceToSQL } from "./utils";

import type { GraphContext } from "./create-data-graph";
import type { SourceTransform, Transform } from "./types/transform-type";

export type DataState = RootDataNodeState | DataNodeState;

type RootDataNodeState = {
  type: "root",
  source: string | Array<SourceTransform | DataState>,
  name: string,
  transform: Array<Transform>,
  children: Array<Node>
};

type DataNodeState = {
  type: "data",
  name: string,
  source: DataNode,
  transform: Array<Transform>,
  children: Array<DataNode>
};

export type InitialDataNodeState = {
  source?: DataNode | string,
  name: string | number,
  transform?: Array<Transform>,
  children?: Array<DataNode>
};

export type DataNode = {
  getState: () => RootDataNodeState | DataNodeState,
  transform: (transform: Transform | Array<Transform> | Function) => DataNode,
  toSQL: () => string,
  values: () => Promise<Array<any>>,
  data: (state: InitialDataNodeState) => DataNode
};

export default function createDataNode(
  context: GraphContext,
  initialState: InitialDataNodeState
) {
  let state = {
    type: initialState.type || "data",
    name: initialState.name,
    source: initialState.source,
    transform: initialState.transform || [],
    children: initialState.children || []
  };

  return {
    getState(): DataState {
      return state;
    },

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

    toSQL(): string {
      return context.parser.write(reduceToSQL(context, this));
    },

    values() {
      return context.connector.query(
        context.parser.write(reduceToSQL(context, this))
      );
    },

    data(childState: InitialDataNodeState): DataNode {
      const dataNode = createDataNode(context, { ...childState, source: this });
      state.children.push(dataNode);
      return dataNode;
    }
  };
}
