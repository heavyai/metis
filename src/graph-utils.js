// @flow
type iterator = (node: DataState) => any
type xform = (a: any, b: any) => any

import {writeSQL} from "./write-sql"

const identity = a => a

function createNodeReducer (state: GraphState) {
  return function reduceNode(leftNode: DataState, rightNode: DataState): DataState {
    return {
      source: state.hasOwnProperty(rightNode.source) ? leftNode.source : rightNode.source,
      transform: leftNode.transform.concat(rightNode.transform)
    }
  }
}

export function walk (state: GraphState, name: string, iterator: iterator, xform: xform, accum: any): any {
  const node = state[name]
  const {source} = node
  accum = xform(accum, iterator(node))
  return state.hasOwnProperty(source) ?
    walk(state, source, iterator, xform, accum) : accum
}

export function reduceNodes (state: GraphState, name: string): DataState {
  return walk(state, name, identity, createNodeReducer(state), {
    source: "",
    transform: []
  })
}

export function nodePathToSQL (state: GraphState, source: string): string {
  return writeSQL(reduceNodes(state, source))
}
