// @flow
import Parser from "./parser";

export default function parseDataState(
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
    (sql: SQL, t: Transform): SQL => parser.parseTransform(sql, t, parser),
    {
      select: initialSQL.select,
      from: typeof source === "string" ? source : parser.parseSource(source),
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
