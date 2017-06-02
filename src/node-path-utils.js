// @flow
type iterator = (node: DataState) => any;
type xform = (a: any, b: any) => any;

import writeSQL from "./sql/write-sql";

const identity = a => a;

function createNodeReducer(state: GraphState) {
  return function reduceNode(
    leftNode: DataState,
    rightNode: DataState
  ): DataState {
    return {
      name: "",
      source: state.hasOwnProperty(rightNode.source)
        ? leftNode.source
        : rightNode.source,
      transform: leftNode.transform.concat(rightNode.transform)
    };
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
  return state.hasOwnProperty(source)
    ? walk(state, source, iterator, xform, accum)
    : accum;
}

export function reduceNodes(state: GraphState, name: string): DataState {
  return walk(state, name, identity, createNodeReducer(state), {
    name: "",
    source: "",
    transform: []
  });
}

const resolvedFilter = (
  transforms: Array<Transform>,
  signal: string
): ?Transform => {
  return transforms.filter((transform: Transform): boolean => {
    return (
      transform.type === "resolvefilter" && transform.filter.signal === signal
    );
  })[0];
};

export function resolveFilters(state: DataState): DataState {
  function reduceXFilters(
    transforms: Array<Transform>,
    transform: Transform
  ): Array<Transform> {
    if (transform.type === "crossfilter") {
      const resolved = resolvedFilter(state.transform, transform.signal);
      if (
        resolved !== null &&
        typeof resolved === "object" &&
        resolved.type === "resolvefilter"
      ) {
        transform.filter.forEach((filter: Filter) => {
          if (
            Array.isArray(resolved.ignore) &&
            resolved.ignore.indexOf(filter.id) === -1
          ) {
            transforms.push(filter);
          } else if (
            typeof resolved.ignore === "string" &&
            resolved.ignore !== filter.id
          ) {
            transforms.push(filter);
          }
        });
      }
      return transforms;
    } else {
      return transforms.concat(transform);
    }
  }

  state.transform = state.transform
    .reduce(reduceXFilters, [])
    .filter(transform => transform.type !== "resolvefilter");

  return state;
}

export function nodePathToSQL(state: GraphState, source: string): string {
  return writeSQL(resolveFilters(reduceNodes(state, source)));
}
