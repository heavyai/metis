

export default function parseDataState(state, parser) {
  var initialSQL = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
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

  return state.transform.reduce(function (sql, t) {
    return parser.parseTransform(sql, t);
  }, {
    select: initialSQL.select,
    from: state.type === "root" ? typeof state.source === "string" ? state.source : parser.parseSource(state.source) : initialSQL.from,
    where: initialSQL.where,
    groupby: initialSQL.groupby,
    having: initialSQL.having,
    orderby: initialSQL.orderby,
    limit: initialSQL.limit,
    offset: initialSQL.offset,
    unresolved: initialSQL.unresolved
  });
}