import defaultParser from "./create-parser";

function joinRelation(type) {
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

export default function parseSource(transforms) {
  var parser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultParser;

  return transforms.reduce(function (stmt, transform, index) {
    if (typeof transform.table === "string" && transform.type === "scan") {
      return stmt.concat(transform.table);
    } else if (transform.type === "join" || transform.type === "join.inner" || transform.type === "join.left" || transform.type === "join.right") {
      var right = stmt.pop();
      var left = stmt.pop();
      var joinType = typeof transform.type === "string" ? transform.type : "join";
      // $FlowFixMe
      var joinStmt = left + " " + joinRelation(joinType) + " " + right;
      var aliasStmt = typeof transform.as === "string" ? " as " + transform.as : "";
      return stmt.concat(joinStmt + aliasStmt);
    } else if (transform.type === "data" || transform.type === "root") {
      // $FlowFixMe
      var subquery = parser.writeSQL(transform);
      return stmt.concat("(" + subquery + ")");
    } else {
      return stmt;
    }
  }, []).join();
}