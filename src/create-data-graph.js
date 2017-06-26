// @flow
import createDataNode from "./create-data-node";
import { createParser } from "./parser/create-parser";
import invariant from "invariant";

import type { Parser } from "./parser/create-parser";
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

export default function createDataGraph(connector: Connector): DataGraph {
  invariant(typeof connector.query === "function", "invalid connector");

  const context = {
    connector,
    parser: createParser()
  };

  const children = [];

  return {
    registerParser(typeDef: TypeDefinition, parseDef: Function): void {
      context.parser.registerParser(typeDef, parseDef);
    },

    children(): Array<DataNode> {
      return children;
    },

    data(
      state: string | Array<SourceTransform | DataState> | InitialDataNodeState
    ): DataNode {
      const dataNode = createDataNode(
        context,
        typeof state === "string" || Array.isArray(state)
          ? { source: state, type: "root" }
          : { ...state, type: "root" }
      );
      children.push(dataNode);
      return dataNode;
    }
  };
}
