// @flow
import parseAggregate from "./parse-aggregate";
import parseBin from "./parse-bin";
import parseCrossfilter from "./parse-crossfilter";
import parseSort from "./parse-sort";
import parseLimit from "./parse-limit";
import parseFilter from "./parse-filter";
import parseProject from "./parse-project";
import parseResolvefilter from "./parse-resolvefilter";
import parseSample from "./parse-sample";
import parseSource from "./parse-source";
import Parser from "./parser";

function parseTransform (sql: SQL, t: Transform, parser: any = Parser): SQL {
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
      return parseSample(sql, t);
    case "resolvefilter":
      return parseResolvefilter(sql, t);
    case "crossfilter":
      return parseCrossfilter(sql, t);
    default:
      return sql;
  }
}

export default function parse(
  { source, transform }: DataState,
  parser: any = Parser,
  initialSQL?: SQL = {
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
): SQL {
  return transform.reduce(
    (sql: SQL, t: Transform): SQL => {
      return parseTransform(sql, t, parser)
    },
    {
      select: initialSQL.select,
      from: typeof source === "string" ? source : parseSource(source),
      where: initialSQL.where,
      groupby: initialSQL.groupby,
      having: initialSQL.having,
      orderby: initialSQL.orderby,
      limit: initialSQL.limit,
      offset: initialSQL.offset,
      unresolved: initialSQL.unresolved
    }
  );
}
