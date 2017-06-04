declare type Expression = ConditionalExpression | OperationExpression | DataState

declare type OperationExpression = {
  type: "=" | "<>" | "<" | ">" | "<=" | ">=" | "ilike" | "like" | "between",
  not?: boolean,
  left: string | number,
  right: string | number
}

declare type ConditionalExpression = CoalesceExpression | CaseExpression

declare type CoalesceExpression = {|
  type: "coalesce",
  values: Array<string>
|}

declare type CaseExpression = {|
  type: "case",
  cond: Array<[Expression | string, string]>,
  else: string,
|}
