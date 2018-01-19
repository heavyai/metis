var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Creates a Project transform
 * @memberof Transform
 */
export function project(expr) {
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
export function aggregate(groupby, agg) {
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
export function filter(expr) {
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
export function filterRange(field, range) {
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
export function filterIn(field, set) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  return {
    type: "filter",
    id: id,
    expr: {
      type: "in",
      expr: field,
      set: set
    }
  };
}

/**
 * Creates a Bin tranform
 * @memberof Transform
 */
export function bin(alias, field, extent, maxbins) {
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
export function limit(row, offset) {
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
export function sort(field, order) {
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
export function top(field, limit, offset) {
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
export function bottom(field, limit, offset) {
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