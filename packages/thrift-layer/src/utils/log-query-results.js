export default function logQueryResults (query, result) {
  console.log(
    query,
    "- Execution Time:",
    result.execution_time_ms,
    " ms, Total Time:",
    result.total_time_ms + "ms"
  )
}
