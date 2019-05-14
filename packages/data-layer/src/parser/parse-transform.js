// @flow
import parseAggregate from "./parse-aggregate";
import parseBin from "./parse-bin";
import parseCrossfilter from "./parse-crossfilter";
import parseSort from "./parse-sort";
import parseLimit from "./parse-limit";
import parseFilter from "./parse-filter";
import parsePostFilter from "./parse-postFilter";
import parseProject from "./parse-project";
import parseResolvefilter from "./parse-resolvefilter";
import parseSample from "./parse-sample";
import parseSource from "./parse-source";
import parseWith from "./parse-with"

import type { SQL } from "./write-sql";
import type { Parser } from "./create-parser";

export default function parseTransform(
  sql: SQL,
  t: Transform,
  parser: Parser
): SQL {
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
    case "postFilter":
      return parsePostFilter(sql, t, parser);
    case "project":
      return parseProject(sql, t, parser);
    case "sample":
      return parseSample(sql, t);
    case "resolvefilter":
      return parseResolvefilter(sql, t);
    case "crossfilter":
      return parseCrossfilter(sql, t);
    case "with":
      return parseWith(sql, t, parser);
    /* istanbul ignore next */
    default:
      return sql;
  }
}
