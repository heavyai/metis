// @flow
export function writeSQL ({source, transform}: DataState): string {
  const selectClause = `SELECT * `
  const fromClause = `FROM ${source}`
  const whereClause = ""

  return selectClause + fromClause + whereClause
}
