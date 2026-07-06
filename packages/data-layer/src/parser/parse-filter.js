// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

// @flow
import Parser from "./create-parser";
import type { SQL } from "./write-sql";

export default function parseFilter(
  sql: SQL,
  transform: Filter,
  parser: any = Parser
): SQL {
  switch (transform.type) {
    case "filter":
      sql.where.push(
        "(" +
          (typeof transform.expr === "object"
            ? parser.parseExpression(transform.expr)
            : transform.expr) +
          ")"
      );
    default:
      return sql;
  }
}
