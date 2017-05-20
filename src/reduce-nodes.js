const identity = a => a

function createNodeReducer (state) {
  return function reduceNode(leftNode, rightNode) {
    return {
      source: state.hasOwnProperty(rightNode.source) ? leftNode.source : rightNode.source,
      transform: leftNode.transform.concat(rightNode.transform)
    }
  }
}

function walk (state, name, iterator, xform, accum) {
  const node = state[name]
  const {source} = node
  accum = xform(accum, iterator(node))
  return state.hasOwnProperty(source) ?
    walk(state, source, iterator, xform, accum) : accum
}

export default function reduceNodes (state, name) {
  return walk(state, name, identity, createNodeReducer(state), {
    source: "",
    transform: []
  })
}
