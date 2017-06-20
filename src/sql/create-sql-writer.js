
function createSQLWriter () {

  const transformParsers = []
  const expressionParsers = []
  const sourceParsers = []

  function registerParser (definition, parser) {
    switch (definition) {
      case "expression":
        expressionParsers.push(parser)
        return
      case "transform":
        transformParsers.push(parser)
        return
      case "source":
        sourceParsers.push(parser)
        return
      default:
        return
    }
  }

  const parser = {
    parseTransform,
    parseSource,
    parseExpression,
    writeSQL
  }

  function parseTransform (data, sql) {
    return transformParsers.reduce((sql, parser) => {

    }, sql)
  }

  function parseSource () {

  }

  function parseExpression () {

  }

  function writeSQL (data) {

  }


  return {
    writeSQL
  }
}
