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

export default function parseTransform(sql, t, parser) {
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
    /* istanbul ignore next */
    default:
      return sql;
  }
}