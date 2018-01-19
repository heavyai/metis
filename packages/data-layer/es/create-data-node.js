var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import invariant from "invariant";
import { reduceToSQL } from "./utils";

export default function createDataNode(context) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var state = {
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
  var dataNodeAPI = {
    getState: getState,
    transform: transform,
    toSQL: toSQL,
    values: values,
    data: data
  };

  /**
   * Returns the state of the data node.
   * @memberof Data
   * @inner
   */
  function getState() {
    return state;
  }

  /**
   * Sets the transform state of the data node. Either takes in an array of
   * transforms or a function that takes and returns an array of transforms
   * @memberof Data
   * @inner
   */
  function transform(setter) {
    state.transform = typeof setter === "function" ? setter(state.transform) : setter;
    return dataNodeAPI;
  }

  /**
   * Returns the SQL string representation of the set of transforms from
   * the node instance to its source root in the graph
   * @memberof Data
   * @inner
   */
  function toSQL() {
    return context.parser.write(reduceToSQL(context, dataNodeAPI));
  }

  /**
   * Uses the `connector` in the graph context to execute data node's
   * SQL query representation and returns queried data as a promise.
   * @memberof Data
   * @inner
   */
  function values() {
    return context.connector.query(context.parser.write(reduceToSQL(context, dataNodeAPI)));
  }

  /**
   * Creates a data node instance and sets it as a child of the parent.
   * @memberof Data
   * @inner
   */
  function data(childState) {
    var dataNode = createDataNode(context, _extends({}, childState, {
      source: dataNodeAPI
    }));
    state.children.push(dataNode);
    return dataNode;
  }

  return dataNodeAPI;
}