(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.DataGraph = global.DataGraph || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function parseExpression(expression) {
  var parser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultParser;

  if (typeof expression === "string" || !(typeof expression === "undefined" ? "undefined" : _typeof(expression)) === "object") {
    return expression;
  }

  switch (expression.type) {
    case "=":
    case "<>":
    case "<":
    case ">":
    case "<=":
    case ">=":
      return expression.left + " " + expression.type + " " + (typeof expression.right === "string" ? "'" + expression.right + "'" : expression.right);
    case "between":
    case "not between":
      return expression.field + " " + expression.type.toUpperCase() + " " + expression.left + " AND " + expression.right;
    case "is null":
    case "is not null":
      return expression.field + " " + expression.type.toUpperCase();
    case "ilike":
    case "like":
    case "not like":
      return expression.left + " " + expression.type.toUpperCase() + " " + ("'%" + expression.right + "%'");
    case "coalesce":
      return "COALESCE(" + expression.values.map(function (field) {
        return "'" + field + "'";
      }).join(", ") + ")";
    case "in":
    case "not in":
      if (Array.isArray(expression.set)) {
        return expression.expr + " " + expression.type.toUpperCase() + " (" + expression.set.map(function (field) {
          return typeof field === "number" ? field : "'" + field + "'";
        }).join(", ") + ")";
      } else if (_typeof(expression.set) === "object" && (expression.set.type === "data" || expression.set.type === "root")) {
        return expression.expr + " " + expression.type.toUpperCase() + " (" + parser.writeSQL(expression.set) + ")";
      } else {
        return expression;
      }
    case "not":
      return "NOT(" + parseExpression(expression.expr) + ")";
    case "and":
    case "or":
      return "(" + parseExpression(expression.left) + " " + expression.type.toUpperCase() + " " + parseExpression(expression.right) + ")";
    case "case":
      return "CASE WHEN " + expression.cond.map(function (cond) {
        return parseExpression(cond[0]) + " THEN " + cond[1];
      }).join(" ") + (expression.else ? " ELSE '" + expression.else + "'" : "") + " END";
    case "date_trunc":
      return "date_trunc(" + expression.unit + ", " + expression.field + ")";
    case "extract":
      return "extract(" + expression.unit + " from " + expression.field + ")";
    case "root":
      return "(" + parser.writeSQL(expression) + ")";
    case "count":
      if (expression.distinct && expression.approx) {
        return "approx_count_distinct(" + expression.field + ")";
      } else if (expression.distinct) {
        return "count(distinct " + expression.field + " )";
      } else {
        return "count(" + expression.field + ")";
      }
    case "stddev":
    case "stddev_pop":
    case "stddev_samp":
    case "var_pop":
    case "var_samp":
      return expression.type + "(" + expression.x + ")";
    case "corr":
    case "covar_pop":
    case "covar_samp":
      return expression.type + "(" + expression.x + ", " + expression.y + ")";
    case "min":
    case "max":
    case "sum":
      return expression.type + "(" + expression.field + ")";
    case "average":
      return "avg(" + expression.field + ")";
    default:
      return expression;
  }
}

function parseDataState(state, parser) {
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

var AGGREGATES = {
  average: "AVG",
  count: "COUNT",
  min: "MIN",
  max: "MAX",
  sum: "SUM"
};

function parseAggregate(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultParser;

  if (Array.isArray(transform.groupby)) {
    transform.groupby.forEach(function (group) {
      sql = parseGroupBy(sql, group, parser);
    });
  } else {
    sql = parseGroupBy(sql, transform.groupby, parser);
  }

  transform.fields.forEach(function (field, index) {
    var as = transform.as[index];
    sql.select.push(aggregateField(transform.ops[index], field, as));
  });

  return sql;
}

function aggregateField(op, field, as) {
  var str = "";
  if (op === null) {
    str += field;
  } else if (AGGREGATES[op]) {
    str += AGGREGATES[op] + "(" + field + ")";
  } else {
    str += op + "(" + field + ")";
  }

  return str + ("" + (as ? " as " + as : ""));
}

function parseGroupBy(sql, groupby, parser) {
  if (typeof groupby === "string") {
    sql.select.push(groupby);
    sql.groupby.push(groupby);
  } else if (groupby.type === "bin") {
    sql = parser.parseTransform(sql, groupby);
    sql.groupby.push(groupby.as);
  } else if (groupby.type === "project") {
    sql.select.push(parser.parseExpression(groupby.expr) + (groupby.as ? " as " + groupby.as : ""));
    if (groupby.as) {
      sql.groupby.push(groupby.as);
    }
  }
  return sql;
}

function parseBin(sql, _ref) {
  var field = _ref.field,
      as = _ref.as,
      extent = _ref.extent,
      maxbins = _ref.maxbins;

  sql.select.push("cast((cast(" + field + " as float) - " + extent[0] + ") * " + maxbins / (extent[1] - extent[0]) + " as int) as " + as);
  sql.where.push("((" + field + " >= " + extent[0] + " AND " + field + " <= " + extent[1] + ") OR (" + field + " IS NULL))");
  sql.having.push("(" + as + " >= 0 AND " + as + " < " + maxbins + " OR " + as + " IS NULL)");
  return sql;
}

function parseFilter(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultParser;

  switch (transform.type) {
    case "filter":
      sql.where.push("(" + (_typeof(transform.expr) === "object" ? parser.parseExpression(transform.expr) : transform.expr) + ")");
    default:
      return sql;
  }
}

function parseCrossfilter(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultParser;

  switch (transform.type) {
    case "crossfilter":
      if (_typeof(sql.unresolved) === "object") {
        if (sql.unresolved.hasOwnProperty(transform.signal)) {
          Object.keys(transform.filter).forEach(function (key) {
            var filter = transform.filter[key];
            if (sql.unresolved) {
              var ignore = sql.unresolved[transform.signal].ignore;

              if (Array.isArray(ignore) ? ignore.indexOf(key) === -1 : key !== ignore) {
                parseFilter(sql, filter, parser);
              }
            }
          });
        }
      }
    default:
      return sql;
  }
}

var ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
};


function parseSort(sql, transform) {
  transform.field.forEach(function (field, index) {
    sql.orderby.push(field + (Array.isArray(transform.order) ? " " + ORDERINGS[transform.order[index]] : ""));
  });
  return sql;
}

function parseLimit(sql, transform) {
  sql.limit += transform.row;
  sql.offset += transform.offset || sql.offset;
  return sql;
}

function parseProject(sql, transform) {
  var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultParser;

  sql.select.push(parser.parseExpression(transform.expr) + (transform.as ? " as " + transform.as : ""));
  return sql;
}

function parseResolvefilter(sql, transform) {
  switch (transform.type) {
    case "resolvefilter":
      if (_typeof(sql.unresolved) === "object") {
        sql.unresolved[transform.filter.signal] = transform;
      } else {
        sql.unresolved = defineProperty({}, transform.filter.signal, transform);
      }
    default:
      return sql;
  }
}

var GOLDEN_RATIO = 265445761;

var THIRTY_TWO_BITS = 4294967296;

function sample(sql, transform) {
  /* istanbul ignore else */
  if (transform.method === "multiplicative") {
    var size = transform.size,
        limit = transform.limit;

    var ratio = Math.min(limit / size, 1.0);
    if (ratio < 1) {
      var threshold = Math.floor(THIRTY_TWO_BITS * ratio);
      sql.where.push("MOD(" + sql.from + ".rowid * " + GOLDEN_RATIO + ", " + THIRTY_TWO_BITS + ") < " + threshold);
    }
  }

  return sql;
}

function joinRelation(type) {
  switch (type) {
    case "join.left":
      return "LEFT JOIN";
    case "join.right":
      return "RIGHT JOIN";
    case "join.inner":
      return "INNER JOIN";
    case "join":
    default:
      return "JOIN";
  }
}

function parseSource(transforms) {
  var parser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultParser;

  return transforms.reduce(function (stmt, transform, index) {
    if (typeof transform.table === "string" && transform.type === "scan") {
      return stmt.concat(transform.table);
    } else if (transform.type === "join" || transform.type === "join.inner" || transform.type === "join.left" || transform.type === "join.right") {
      var right = stmt.pop();
      var left = stmt.pop();
      var joinType = typeof transform.type === "string" ? transform.type : "join";
      // $FlowFixMe
      var joinStmt = left + " " + joinRelation(joinType) + " " + right;
      var aliasStmt = typeof transform.as === "string" ? " as " + transform.as : "";
      return stmt.concat(joinStmt + aliasStmt);
    } else if (transform.type === "data" || transform.type === "root") {
      // $FlowFixMe
      var subquery = parser.writeSQL(transform);
      return stmt.concat("(" + subquery + ")");
    } else {
      return stmt;
    }
  }, []).join();
}

function parseTransform(sql, t, parser) {
  switch (t.type) {
    case "aggregate":
      return parseAggregate(sql, t, parser);
    case "bin":
      return parseBin(sql, t);
    case "sort":
      return parseSort(sql, t);
    case "limit":
      return parseLimit(sql, t);
    case "filter":
      return parseFilter(sql, t, parser);
    case "project":
      return parseProject(sql, t, parser);
    case "sample":
      return sample(sql, t);
    case "resolvefilter":
      return parseResolvefilter(sql, t);
    case "crossfilter":
      return parseCrossfilter(sql, t);
    /* istanbul ignore next */
    default:
      return sql;
  }
}

function writeSQL(state, parser) {
  return write(parser.parseDataState(state));
}


function write(sql) {
  return writeSelect(sql.select) + writeFrom(sql.from) + writeWhere(sql.where) + writeGroupby(sql.groupby) + writeHaving(sql.having) + writeOrderBy(sql.orderby) + writeLimit(sql.limit) + writeOffset(sql.offset);
}

function writeSelect(select) {
  return select.length ? "SELECT " + select.join(", ") : "SELECT *";
}

function writeFrom(from) {
  return " FROM " + from;
}

function writeWhere(where) {
  return where.length ? " WHERE " + where.join(" AND ") : "";
}

function writeGroupby(groupby) {
  return groupby.length ? " GROUP BY " + groupby.join(", ") : "";
}

function writeHaving(having) {
  return having.length ? " HAVING " + having.join(" AND ") : "";
}

function writeOrderBy(orderby) {
  return orderby.length ? " ORDER BY " + orderby.join(", ") : "";
}

function writeLimit(limit) {
  return limit.length ? " LIMIT " + limit : "";
}

function writeOffset(offset) {
  return offset.length ? " OFFSET " + offset : "";
}

/**
 * Creates a parser than can parse expressions, transforms, and intermediary
 * SQL representations. This parser is used internally by the data graph.
 * @see {@link Parser} for further information.
 * @memberof API
 */
function createParser() {
  var transformParsers = {};
  var expressionParsers = {};

  /**
   * A collection of functions used for parsing expressions, transforms, and
   * intermediary SQL representations
   * @namespace Parser
   */
  var parser = {
    parseExpression: parseExpression$$1,
    parseTransform: parseTransform$$1,
    parseDataState: parseDataState$$1,
    parseSource: parseSource$$1,
    writeSQL: writeSQL$$1,
    write: write,
    registerParser: registerParser
  };

  /**
   * Returns all child data node instances of the graph.
   * @memberof Parser
   * @inner
   */
  function registerParser(definition, typeParser) {
    if (definition.meta === "expression") {
      expressionParsers[definition.type] = typeParser;
    } else if (definition.meta === "transform") {
      transformParsers[definition.type] = typeParser;
    }
  }

  /**
   * Parses expressions and returns a valid SQL expression string
   * @memberof Parser
   * @inner
   * @see {@link Expression} for further information.
   */
  function parseExpression$$1(expression) {
    if (expressionParsers[expression.type]) {
      return expressionParsers[expression.type](expression, parser);
    }
    return parseExpression(expression, parser);
  }

  /**
   * Parses transforms and returns an intermediary SQL representation
   * @memberof Parser
   * @inner
   * @see {@link Transform} for further information.
   */
  function parseTransform$$1(sql, transform) {
    if (transformParsers[transform.type]) {
      return transformParsers[transform.type](sql, transform, parser);
    }
    return parseTransform(sql, transform, parser);
  }

  /**
   * Parses a data node state and returns an intermediary SQL representation
   * @memberof Parser
   * @inner
   */
  function parseDataState$$1(data, sql) {
    return parseDataState(data, parser, sql);
  }

  /**
   * Parses a source transform and returns a valid SQL FROM clause
   * @memberof Parser
   * @inner
   */
  function parseSource$$1(sourceTransforms) {
    return parseSource(sourceTransforms, parser);
  }

  /**
  * Parses a data node state and returns a valid SQL string
   * @memberof Parser
   * @inner
   */
  function writeSQL$$1(state) {
    return writeSQL(state, parser);
  }

  return parser;
}

var defaultParser = createParser();

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

var identity = function identity(a) {
  return a;
};


function traverse(node, iterator, xform, accum) {
  accum = xform(accum, iterator(node));
  var source = node.getState().source;
  return (typeof source === "undefined" ? "undefined" : _typeof(source)) === "object" && !Array.isArray(source) ? traverse(source, iterator, xform, accum) : accum;
}

function reduceToSQL(context, node) {
  var initialSQL = {
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

function createDataNode(context) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var state = {
    type: initialState.type || "data",
    source: initialState.source,
    transform: initialState.transform || [],
    children: initialState.children || []
  };

  /**
   * A node in the graph that represents a set of data transformations.
   * @namespace Data
   * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/create-data-node.js|create-data-node.js}
   */
  var dataNodeAPI = {
    getState: getState,
    transform: transform,
    toSQL: toSQL,
    values: values,
    data: data
  };

  /**
   * Returns the state of the data node.
   * @memberof Data
   * @inner
   */
  function getState() {
    return state;
  }

  /**
   * Sets the transform state of the data node. Either takes in an array of
   * transforms or a function that takes and returns an array of transforms
   * @memberof Data
   * @inner
   */
  function transform(setter) {
    state.transform = typeof setter === "function" ? setter(state.transform) : setter;
    return dataNodeAPI;
  }

  /**
   * Returns the SQL string representation of the set of transforms from
   * the node instance to its source root in the graph
   * @memberof Data
   * @inner
   */
  function toSQL() {
    return context.parser.write(reduceToSQL(context, dataNodeAPI));
  }

  /**
   * Uses the `connector` in the graph context to execute data node's
   * SQL query representation and returns queried data as a promise.
   * @memberof Data
   * @inner
   */
  function values() {
    return context.connector.query(context.parser.write(reduceToSQL(context, dataNodeAPI)));
  }

  /**
   * Creates a data node instance and sets it as a child of the parent.
   * @memberof Data
   * @inner
   */
  function data(childState) {
    var dataNode = createDataNode(context, _extends({}, childState, {
      source: dataNodeAPI
    }));
    state.children.push(dataNode);
    return dataNode;
  }

  return dataNodeAPI;
}

/**
 * Creates a data graph instance. Must pass in a connector object that implements a query method.
 * @see {@link Graph} for further information.
 * @memberof API
 */
function createDataGraph(connector) {
  invariant_1(typeof connector.query === "function", "invalid connector");

  var context = {
    connector: connector,
    parser: createParser()
  };

  var childNodes = [];

  /**
   * An instance of a data graph. A data graph is basically a tree, where each
   * node represents a
   * @namespace Graph
   */
  var graphAPI = {
    registerParser: registerParser,
    children: children,
    data: data
  };

  /**
   * Registers a custom expression or transform parser. The `typeDef` argument
   * must be a valid type definition and the `typeParser` argument must be a
   * function that matches the type of an ExpressionParser or TransformParser
   * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/parser/createParser.js|createParser.js}
   * @memberof Graph
   * @inner
   */
  function registerParser(typeDef, typeParser) {
    context.parser.registerParser(typeDef, typeParser);
  }

  /**
   * Returns all child data node instances of the graph.
   * @memberof Graph
   * @inner
   */
  function children() {
    return childNodes;
  }

  /**
   * Creates a root data node instance. The source must be specific in the
   * initial state. An example of a source, is a string pointing to a tables
   * or an array of source transformations.
   * @memberof Graph
   * @inner
   */
  function data(state) {
    var dataNode = createDataNode(context, typeof state === "string" || Array.isArray(state) ? { source: state, type: "root" } : _extends({}, state, { type: "root" }));
    childNodes.push(dataNode);
    return dataNode;
  }

  return graphAPI;
}

/**
 * Creates an alias expression
 * @memberof Expression
 */
function alias(as, expr) {
  return {
    expr: expr,
    as: as
  };
}

/**
 * Creates an average expression
 * @memberof Expression
 */

/**
 * Expression builders. These are helper functions to create expression objects
 * @name expr
 * @memberof API
 * @see {@link Expression}
 */

/**
 * Expression builder module.
 * @name Expression
 * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/types/expression-type.js|Expression Types}
 */
function avg(alias, field) {
  return {
    type: "average",
    field: field,
    as: alias
  };
}

/**
 * creates a min expression
 * @memberof Expression
 */
function min(alias, field) {
  return {
    type: "min",
    field: field,
    as: alias
  };
}

/**
 * creates a max expression
 * @memberof Expression
 */
function max(alias, field) {
  return {
    type: "max",
    field: field,
    as: alias
  };
}

/**
 * creates a sum expression
 * @memberof Expression
 */
function sum(alias, field) {
  return {
    type: "sum",
    field: field,
    as: alias
  };
}

/**
 * creates a count expression
 * @memberof Expression
 */
function count(distinct, alias, field) {
  return {
    type: "count",
    distinct: distinct,
    approx: false,
    field: field,
    as: alias
  };
}

/**
 * creates an approx count expression
 * @memberof Expression
 */
function approxCount(distinct, alias, field) {
  return {
    type: "count",
    distinct: distinct,
    approx: true,
    field: field,
    as: alias
  };
}

/**
 * creates a count star expression
 * @memberof Expression
 */
function countStar(alias) {
  return {
    type: "count",
    distinct: false,
    approx: false,
    field: "*",
    as: alias
  };
}

/**
 * creates an extract function expression
 * @memberof Expression
 */
function extract(unit, field) {
  return {
    type: "extract",
    unit: unit,
    field: field
  };
}

/**
 * creates a date_trunc function expression
 * @memberof Expression
 */
function dateTrunc(unit, field) {
  return {
    type: "date_trunc",
    unit: unit,
    field: field
  };
}

/**
 * creates an in expression
 * @memberof Expression
 */
function inExpr(expr, set) {
  return {
    type: "in",
    expr: expr,
    set: set
  };
}

/**
 * Creates a not expression
 * @memberof Expression
 */
function not(expr) {
  return {
    type: "not",
    expr: expr
  };
}

/**
 * Creates a case expression
 * @memberof Expression
 */
function caseExpr(cond, end) {
  return {
    type: "case",
    cond: cond,
    else: end
  };
}

/**
 * Creates a between expression
 * @memberof Expression
 */
function between(field, range) {
  return {
    type: "between",
    field: field,
    left: range[0],
    right: range[1]
  };
}

var expressionBuilders = Object.freeze({
	alias: alias,
	avg: avg,
	min: min,
	max: max,
	sum: sum,
	count: count,
	approxCount: approxCount,
	countStar: countStar,
	extract: extract,
	dateTrunc: dateTrunc,
	inExpr: inExpr,
	not: not,
	caseExpr: caseExpr,
	between: between
});

/**
 * Creates a Project transform
 * @memberof Transform
 */
function project(expr) {
  // $FlowFixMe
  return {
    type: "project",
    expr: typeof expr === "string" ? expr : expr.expr,
    as: typeof expr === "string" ? null : expr.as
  };
}
/**
 * Transform builders. These are helpers function to create transform objects.
 * @name rel
 * @memberof API
 * @see {@link #transform-1|Transform}
 */

/**
 * Transsform builder module.
 * @name Transform
 * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/types/transform-type.js|Transform Types}
 */


function getAggs(agg) {
  if (Array.isArray(agg)) {
    return {
      fields: agg.map(function (a) {
        return a.field;
      }),
      ops: agg.map(function (a) {
        return a.type;
      }),
      // $FlowFixMe
      as: agg.map(function (a) {
        return a.as;
      })
    };
  } else {
    return {
      fields: [agg.field],
      ops: [agg.type],
      as: [agg.as || ""]
    };
  }
}

function getGroupBy(groupby) {
  if (Array.isArray(groupby)) {
    return groupby.map(function (group) {
      if ((typeof group === "undefined" ? "undefined" : _typeof(group)) === "object") {
        return {
          type: "project",
          expr: group.expr,
          as: group.as
        };
      } else {
        return group;
      }
    });
  } else if ((typeof groupby === "undefined" ? "undefined" : _typeof(groupby)) === "object") {
    return {
      type: "project",
      expr: groupby.expr,
      as: groupby.as
    };
  } else {
    return groupby;
  }
}

/**
 * Creates an Aggregate transform
 * @memberof Transform
 */
function aggregate(groupby, agg) {
  var aggs = getAggs(agg);
  var group = getGroupBy(groupby);
  return {
    type: "aggregate",
    fields: aggs.fields,
    ops: aggs.ops,
    as: aggs.as,
    groupby: group
  };
}

/**
 * Creates an Filter transform
 * @memberof Transform
 */
function filter(expr) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  return {
    type: "filter",
    id: id,
    expr: expr
  };
}

/**
 * Creates an Filter transform that uses a between expression
 * @memberof Transform
 */
function filterRange(field, range) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  return {
    type: "filter",
    id: id,
    expr: {
      type: "between",
      field: field,
      left: range[0],
      right: range[1]
    }
  };
}

/**
 * Creates an Filter transform that uses an in expression
 * @memberof Transform
 */
function filterIn(field, set$$1) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  return {
    type: "filter",
    id: id,
    expr: {
      type: "in",
      expr: field,
      set: set$$1
    }
  };
}

/**
 * Creates a Bin tranform
 * @memberof Transform
 */
function bin(alias, field, extent, maxbins) {
  return {
    type: "bin",
    field: field,
    extent: extent,
    maxbins: maxbins,
    as: alias
  };
}

/**
 * Creates a Limit transform
 * @memberof Transform
 */
function limit(row, offset) {
  return {
    type: "limit",
    row: row,
    offset: offset
  };
}

/**
 * Creates a Sort transform
 * @memberof Transform
 */
function sort(field, order) {
  return {
    type: "sort",
    field: typeof field === "string" ? [field] : field,
    order: typeof order === "string" ? [order] : order
  };
}

/**
 * Creates a Sort transform ordered by descending and a Limit transform
 * @memberof Transform
 */
function top(field, limit, offset) {
  return [{
    type: "sort",
    field: [field],
    order: ["descending"]
  }, {
    type: "limit",
    row: limit,
    offset: offset
  }];
}

/**
* Creates a Sort transform ordered by ascending and a Limit transform
 * @memberof Transform
 */
function bottom(field, limit, offset) {
  return [{
    type: "sort",
    field: [field],
    order: ["ascending"]
  }, {
    type: "limit",
    row: limit,
    offset: offset
  }];
}



var transformBuilders = Object.freeze({
	project: project,
	aggregate: aggregate,
	filter: filter,
	filterRange: filterRange,
	filterIn: filterIn,
	bin: bin,
	limit: limit,
	sort: sort,
	top: top,
	bottom: bottom
});

/**
 * The exported `mapd-data-layer` module. Consists of a graph constructor and
 * helper functions to build expressions and transforms and to parse them
 * @namespace API
 */

exports.createDataGraph = createDataGraph;
exports.expr = expressionBuilders;
exports.rel = transformBuilders;
exports.createParser = createParser;

Object.defineProperty(exports, '__esModule', { value: true });

})));
