// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

// @flow
import type { SQL } from "./write-sql";

export default function parseLimit(sql: SQL, transform: Limit): SQL {
  sql.limit += transform.row;
  sql.offset += transform.offset || sql.offset;
  return sql;
}
