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
    ...initialState,
    transform: initialState.transform || []
  };

  return {
    getState(): DataState {
      return state;
    },
    transform(transform: Transform | Array<Transform>): DataNode {
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
      return nodePathToSQL(context.state, state.name);
    },
    values(): Promise<Array<any>> {
      return context.connector.query(nodePathToSQL(context.state, state.name));
    }
  };
}
