// @flow
import parseAggregate from "./parse-aggregate"
import parseBin from "./parse-bin"
import parseCollect from "./parse-collect"
import parseFilter from "./parse-filter"
import parseFormula from "./parse-formula"
import parseSample from "./parse-sample"

export default function parse (transforms: Array<Transform>): SQL {
  const initialSQL = {
    select: [],
    from: "",
    where: [],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: ""
  }

  return transforms.reduce((sql: SQL, transform: Transform): SQL => {
    switch (transform.type) {
      case "aggregate":
        return parseAggregate(sql, transform)
      case "bin":
        return parseBin(sql, transform)
      case "collect":
        return parseCollect(sql, transform)
      case "filter":
        return parseFilter(sql, transform)
      case "formula":
        return parseFormula(sql, transform)
      case "sample":
        return parseSample(sql, transform)
      default:
        return sql
    }
  }, initialSQL)
}
