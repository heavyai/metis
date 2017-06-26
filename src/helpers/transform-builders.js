// @flow
import type { DataState } from "../create-data-node";

export function project(
  expr: string | { expr: string | Expression, as: string }
): Project {
  // $FlowFixMe
  return {
    type: "project",
    expr: typeof expr === "string" ? expr : expr.expr,
    as: typeof expr === "string" ? null : expr.as
  };
}

function getAggs(agg) {
  if (Array.isArray(agg)) {
    return {
      fields: agg.map(a => a.field),
      ops: agg.map(a => a.type),
      // $FlowFixMe
      as: agg.map(a => a.as)
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
    return groupby.map(group => {
      if (typeof group === "object") {
        return {
          type: "project",
          expr: group.expr,
          as: group.as
        };
      } else {
        return group;
      }
    });
  } else if (typeof groupby === "object") {
    return {
      type: "project",
      expr: groupby.expr,
      as: groupby.as
    };
  } else {
    return groupby;
  }
}

export function aggregate(
  groupby: AliasExpression | Array<AliasExpression> | string,
  agg: AggregateFunctionExpression | Array<AggregateFunctionExpression>
): Aggregate {
  const aggs = getAggs(agg);
  const group = getGroupBy(groupby);
  return {
    type: "aggregate",
    fields: aggs.fields,
    ops: aggs.ops,
    as: aggs.as,
    groupby: group
  };
}

export function filter(expr: string | Expression, id?: string = ""): Filter {
  return {
    type: "filter",
    id,
    expr
  };
}

export function filterRange(
  field: string,
  range: Array<number | string>,
  id?: string = ""
): Filter {
  return {
    type: "filter",
    id,
    expr: {
      type: "between",
      field,
      left: range[0],
      right: range[1]
    }
  };
}

export function filterIn(
  field: string,
  set: Array<string | number>,
  id?: string = ""
): Filter {
  return {
    type: "filter",
    id,
    expr: {
      type: "in",
      expr: field,
      set
    }
  };
}

export function bin(
  alias: string,
  field: string,
  extent: Array<number>,
  maxbins: number
): Bin {
  return {
    type: "bin",
    field,
    extent,
    maxbins,
    as: alias
  };
}

export function limit(row: number, offset?: number): Limit {
  return {
    type: "limit",
    row,
    offset
  };
}

export function sort(
  field: string | Array<string>,
  order: SortOrder | Array<SortOrder>
): Sort {
  return {
    type: "sort",
    field: typeof field === "string" ? [field] : field,
    order: typeof order === "string" ? [order] : order
  };
}

export function top(
  field: string,
  limit: number,
  offset?: number
): [Sort, Limit] {
  return [
    {
      type: "sort",
      field: [field],
      order: ["descending"]
    },
    {
      type: "limit",
      row: limit,
      offset
    }
  ];
}

export function bottom(
  field: string,
  limit: number,
  offset?: number
): [Sort, Limit] {
  return [
    {
      type: "sort",
      field: [field],
      order: ["ascending"]
    },
    {
      type: "limit",
      row: limit,
      offset
    }
  ];
}
