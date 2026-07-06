// SPDX-FileCopyrightText: Copyright (c) 2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

export default function logQueryResults (query, result) {
  console.log(
    query,
    "- Execution Time:",
    result.execution_time_ms,
    " ms, Total Time:",
    result.total_time_ms + "ms"
  )
}
