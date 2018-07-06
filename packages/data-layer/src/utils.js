// @flow
import type { GraphContext } from "./create-data-graph";
import type { DataNode } from "./create-data-node";
import type { SQL } from "./parser/write-sql";

type iterator = (node: DataNode) => any;
type xform = (a: any, b: any) => any;

const identity = a => a;

export function traverse(
  node: DataNode,
  iterator: iterator,
  xform: xform,
  accum: any
) {
  accum = xform(accum, iterator(node));
  const source = node.getState().source;
  return typeof source === "object" && !Array.isArray(source)
    ? traverse(source, iterator, xform, accum)
    : accum;
}

export function reduceToSQL(context: GraphContext, node: DataNode): SQL {
  const initialSQL = {
    select: [],
    from: "",
    where: [],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: "",
    unresolved: {}
  };

  function toSQL(accum, rightNode) {
    return context.parser.parseDataState(rightNode.getState(), accum);
  }

  return traverse(node, identity, toSQL, initialSQL);
}

export function escapeQuotes(string) {
  if (typeof string === "string") {
    return string.replace(/'/gi, "''")
  } else {
    return string
  }
}
