import Parser from "./create-parser";
import {escapeQuotes} from "../utils"

export default function parseExpression(
  expression: string | Expression,
  parser: any = Parser
): string {
  if (typeof expression === "string" || !typeof expression === "object") {
    return expression;
  }

  switch (expression.type) {
    case "=":
    case "<>":
    case "<":
    case ">":
    case "<=":
    case ">=":
      return expression.left +
        " " +
        expression.type +
        " " +
        (typeof expression.right === "string"
          ? "'" + expression.right + "'"
          : expression.right);
    case "between":
    case "not between":
      return expression.field +
        " " +
        expression.type.toUpperCase() +
        " " +
        expression.left +
        " AND " +
        expression.right;
    case "is null":
    case "is not null":
      return expression.field + " " + expression.type.toUpperCase();
    case "ilike":
    case "like":
    case "not like":
      return expression.left +
        " " +
        expression.type.toUpperCase() +
        " " +
        `'%${expression.right}%'`;
    case "coalesce":
      return "COALESCE(" +
        expression.values.map(field => `'${field}'`).join(", ") +
        ")";
    case "in":
    case "not in":
      if (Array.isArray(expression.set)) {
        return expression.expr +
          " " +
          expression.type.toUpperCase() +
          " (" +
          expression.set
            .map(field => typeof field === "number" ? field : `'${escapeQuotes(field)}'`)
            .join(", ") +
          ")";
      } else if (
        typeof expression.set === "object" &&
        (expression.set.type === "data" || expression.set.type === "root")
      ) {
        return expression.expr +
          " " +
          expression.type.toUpperCase() +
          " (" +
          parser.writeSQL(expression.set) +
          ")";
      } else {
        return expression;
      }
    case "not":
      return "NOT(" + parseExpression(expression.expr) + ")";
    case "and":
    case "or":
      return "(" +
        parseExpression(expression.left) +
        " " +
        expression.type.toUpperCase() +
        " " +
        parseExpression(expression.right) +
        ")";
    case "case":
      const elseCase = expression.else === null ? "NULL" : `'${expression.else}'`
      return "CASE WHEN " +
        expression.cond
          .map(cond => parseExpression(cond[0]) + " THEN " + cond[1])
          .join(" ") +
        (typeof expression.else !== "undefined" ? ` ELSE ${elseCase}` : "") +
        " END";
    case "date_trunc":
      return "date_trunc(" + expression.unit + ", " + expression.field + ")";
    case "extract":
      return "extract(" + expression.unit + " from " + expression.field + ")";
    case "root":
      return "(" + parser.writeSQL(expression) + ")";
    case "count":
      if (expression.distinct && expression.approx) {
        return "approx_count_distinct(" + expression.field + ")";
      } else if (expression.distinct) {
        return "count(distinct " + expression.field + " )";
      } else {
        return "count(" + expression.field + ")";
      }
    case "stddev":
    case "stddev_pop":
    case "stddev_samp":
    case "var_pop":
    case "var_samp":
      return expression.type + "(" + expression.x + ")";
    case "corr":
    case "covar_pop":
    case "covar_samp":
      return expression.type + "(" + expression.x + ", " + expression.y + ")";
    case "min":
    case "max":
    case "sum":
    case "sample":
      return expression.type + "(" + expression.field + ")";
    case "average":
      return "avg(" + expression.field + ")";
    default:
      return expression;
  }
}
