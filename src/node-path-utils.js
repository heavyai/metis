// @flow

type iterator = (node: DataState) => any;
type xform = (a: any, b: any) => any;

import { write } from "./sql/write-sql";

import parseTransform from "./sql/parse-transform";
import Parser from "./sql/parser";

const identity = a => a;

function createNodeReducer(state: GraphState) {
  return function reduceNode(accum: SQL, rightNode: DataState): SQL {
    return parseTransform(rightNode, Parser, accum);
  };
}

export function walk(
  state: GraphState,
  name: string,
  iterator: iterator,
  xform: xform,
  accum: any
): any {
  const node = state[name];
  const { source } = node;
  accum = xform(accum, iterator(node));
  return typeof source === "string" && state.hasOwnProperty(source)
    ? walk(state, source, iterator, xform, accum)
    : accum;
}

export function reduceNodes(state: GraphState, name: string): SQL {
  return walk(state, name, identity, createNodeReducer(state), {
    select: [],
    from: "",
    where: [],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: "",
    unresolved: {}
  });
}

export function nodePathToSQL(state: GraphState, source: string): string {
  return write(reduceNodes(state, source));
}
