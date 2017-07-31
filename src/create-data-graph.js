// @flow
import createDataNode from "./create-data-node";
import { createParser } from "./parser/create-parser";
import invariant from "invariant";

import type { Parser, TypeParser } from "./parser/create-parser";
import type { DataNode, InitialDataNodeState } from "./create-data-node";
import type { TypeDefinition } from "./parser/create-parser";

export type Connector = {
  query: () => Promise<Array<any>>,
  tables: Array<string>
};

export type DataGraph = {
  registerParser: (typeDef: TypeDefinition, parseDef: Function) => void,
  children: () => Array<DataNode>,
  data: (
    state: string | Array<SourceTransform> | InitialDataNodeState
  ) => DataNode
};

export type GraphContext = {
  connector: Connector,
  parser: Parser
};

/**
 * Creates a data graph instance. Must pass in a connector object that implements a query method.
 * @see {@link Graph} for further information.
 * @memberof API
 */
export default function createDataGraph(connector: Connector): DataGraph {
  invariant(typeof connector.query === "function", "invalid connector");

  const context = {
    connector,
    parser: createParser()
  };

  const childNodes = [];

  /**
   * An instance of a data graph. A data graph is basically a tree, where each
   * node represents a
   * @namespace Graph
   */
  const graphAPI = {
    registerParser,
    children,
    data
  };

  /**
   * Registers a custom expression or transform parser. The `typeDef` argument
   * must be a valid type definition and the `typeParser` argument must be a
   * function that matches the type of an ExpressionParser or TransformParser
   * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/parser/createParser.js|createParser.js}
   * @memberof Graph
   * @inner
   */
  function registerParser(
    typeDef: TypeDefinition,
    typeParser: TypeParser
  ): void {
    context.parser.registerParser(typeDef, typeParser);
  }

  /**
   * Returns all child data node instances of the graph.
   * @memberof Graph
   * @inner
   */
  function children(): Array<DataNode> {
    return childNodes;
  }

  /**
   * Creates a root data node instance. The source must be specific in the
   * initial state. An example of a source, is a string pointing to a tables
   * or an array of source transformations.
   * @memberof Graph
   * @inner
   */
  function data(
    state: string | Array<SourceTransform | DataState> | InitialDataNodeState
  ): DataNode {
    const dataNode = createDataNode(
      context,
      typeof state === "string" || Array.isArray(state)
        ? { source: state, type: "root" }
        : { ...state, type: "root" }
    );
    childNodes.push(dataNode);
    return dataNode;
  }

  return graphAPI;
}
