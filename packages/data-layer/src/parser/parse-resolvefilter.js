// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

// @flow
import type { SQL } from "./write-sql";

export default function parseResolvefilter(
  sql: SQL,
  transform: ResolveFilter
): SQL {
  switch (transform.type) {
    case "resolvefilter":
      if (typeof sql.unresolved === "object") {
        sql.unresolved[transform.filter.signal] = transform;
      } else {
        sql.unresolved = {
          [transform.filter.signal]: transform
        };
      }
    default:
      return sql;
  }
}
