// @flow
import parseAggregate from "./parse-aggregate";
import parseBin from "./parse-bin";
import parseCollect from "./parse-collect";
import parseFilter from "./parse-filter";
import parseFormula from "./parse-formula";
import parseSample from "./parse-sample";

export default function parse({ source, transform }: DataState): SQL {
  const initialSQL = {
    select: [],
    from: source,
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
        return parseAggregate(sql, t);
      case "bin":
        return parseBin(sql, t);
      case "collect":
        return parseCollect(sql, t);
      case "filter":
        return parseFilter(sql, t);
      case "formula":
        return parseFormula(sql, t);
      case "sample":
        return parseSample(sql, t);
      default:
        return sql;
    }
  }, initialSQL);
}
