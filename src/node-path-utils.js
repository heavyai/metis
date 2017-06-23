// @flow

type iterator = (node: DataState) => any;
type xform = (a: any, b: any) => any;

const identity = a => a;

function createNodeReducer(parser: any) {
  return function reduceNode(accum: SQL, rightNode: DataState): SQL {
    return parser.parseDataState(rightNode, accum);
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

export function reduceNodes(context: GraphContext, name: string): SQL {
  return walk(
    context.state,
    name,
    identity,
    createNodeReducer(context.parser),
    {
      select: [],
      from: "",
      where: [],
      groupby: [],
      having: [],
      orderby: [],
      limit: "",
      offset: "",
      unresolved: {}
    }
  );
}

export function nodePathToSQL(context: GraphContext, source: string): string {
  return context.parser.write(reduceNodes(context, source));
}
