// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

// @flow
import type { SQL } from "./write-sql";

const ORDERINGS = {
  ascending: "ASC",
  descending: "DESC"
};

export default function parseSort(sql: SQL, transform: Sort) {
  transform.field.forEach((field, index) => {
    sql.orderby.push(
      field +
        (Array.isArray(transform.order)
          ? " " + ORDERINGS[transform.order[index]]
          : "")
    );
  });
  return sql;
}
