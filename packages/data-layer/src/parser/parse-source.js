// @flow
import defaultParser from "./create-parser";

import type { SQL } from "./write-sql";
import type { Parser } from "./create-parser";
import type { DataNode } from "../create-data-node";

type JoinRelationSQL = "JOIN" | "INNER JOIN" | "LEFT JOIN" | "RIGHT JOIN";
function joinRelation(type: JoinRelation): JoinRelationSQL {
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

export default function parseSource(
  transforms: Array<SourceTransform | DataState>,
  parser: Parser = defaultParser
): string {
  return transforms
    .reduce(
      (
        stmt: Array<string>,
        transform: SourceTransform | DataNode,
        index: number
      ): Array<string> => {
        if (typeof transform.table === "string" && transform.type === "scan") {
          return stmt.concat(transform.table);
        } else if (
          transform.type === "join" ||
          transform.type === "join.inner" ||
          transform.type === "join.left" ||
          transform.type === "join.right"
        ) {
          const right = stmt.pop();
          const left = stmt.pop();
          const joinType = typeof transform.type === "string"
            ? transform.type
            : "join";
          // $FlowFixMe
          const joinStmt = left + " " + joinRelation(joinType) + " " + right;
          const aliasStmt = typeof transform.as === "string"
            ? " as " + transform.as
            : "";
          return stmt.concat(joinStmt + aliasStmt);
        } else if (transform.type === "data" || transform.type === "root") {
          // $FlowFixMe
          const subquery = parser.writeSQL(transform);
          return stmt.concat("(" + subquery + ")");
        } else {
          return stmt;
        }
      },
      []
    )
    .join();
}
