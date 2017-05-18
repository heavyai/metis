export default function createDataOperator (context, initialState = {}) {
  if (typeof initialState.name !== "string" || typeof initialState.source !== "string") {
    throw new Error("must have name and source")
  }

  initialState.transform = initialState.transform ? initialState.transform : []
  let state = initialState

  const api = {
    getState,
    transform,
    toSQL,
    values
  }

  function getState () {
    return state
  }

  function transform (transform) {
    if (typeof transform === "function") {
      state = transform(state)
      return api
    } else if (Array.isArray(transform)) {
      state.transform = state.transform.concat(transform)
      return api
    } else if (transform) {
      state.transform.push(transform)
      return api
    } else {
      return state.transform
    }
  }

  function toSQL () {
    return ""
  }

  function values () {
    const stmt = toSQL()
    return context.connector.query(stmt())
  }

  return api
}
