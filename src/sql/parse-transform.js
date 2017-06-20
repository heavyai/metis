// @flow
import parseAggregate from "./parse-aggregate";
import parseBin from "./parse-bin";
import parseSort from "./parse-sort";
import parseLimit from "./parse-limit";
import parseFilter from "./parse-filter";
import parseProject from "./parse-project";
import parseSample from "./parse-sample";
import parseSource from "./parse-source";
import Parser from "./parser";

export default function parse({ source, transform }: DataState, parser: any = Parser): SQL {
  const initialSQL = {
    select: [],
    from: typeof source === "string" ? source : parseSource(source),
    where: [],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: ""
  };

  return transform.reduce((sql: SQL, t: Transform): SQL => {
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
      default:
        return sql;
    }
  }, initialSQL);
}
