# sql-datagraph

[![Build Status](https://travis-ci.org/mrblueblue/sql-datagraph.svg?branch=master)](https://travis-ci.org/mrblueblue/sql-datagraph)
[![coverage](https://img.shields.io/codecov/c/github/mrblueblue/sql-datagraph.svg?style=flat-square)](https://codecov.io/github/mrblueblue/sql-datagraph)

* [**API Documentation**](docs/API.md)
* [**Crossfiltering Vega Example**](https://mrblueblue.github.io/sql-datagraph/example/)

Declaratively build SQL data pipelines. Based on the [Vega Transform API](https://vega.github.io/vega/docs/transforms/).

Each node in the graph represents a transformation of data. Root nodes are "scans" of SQL tables.

The path from a child node to its root represents a data transformation pipeline. This pipeline can be described as a SQL query or a set of transformations described in JSON notation.


### Example

```js

const graph = createGraph(connector)

const parent = graph.data({
  name: "parent",
  source: "contributions"
})

// "SELECT * from contributions"
parent.toSQL()

const child = graph.data({
  name: "child",
  source: "parent",
  transform: [
     {
      "type": "formula",
      "field": "contrib_date",
      "as": "key0",
      "dateTrunc": "year",
      "cast": "timestamp"
    },
    {
      "type": "aggregate",
      "groupby": ["key0"],
      "fields": ["amount"],
      "ops": ["average"],
      "as": ["series_1"]
    },
    {
      "type": "collect",
      "sort": { "field": "key0" }
    },
    {
      "type": "filter",
      "field": "contrib_date",
      "range": ["1996-11-05 17:47:30", "2010-10-21 10:54:07"]
    },
    {
      "type": "filter",
      "isNull": false
    }
  ]
})

/*
SELECT
  date_trunc(year, CAST(contrib_date AS TIMESTAMP(0))) as key0,
  AVG(amount) AS series_1
FROM contributions
WHERE
  (CAST(contrib_date AS TIMESTAMP(0)) >= TIMESTAMP(0) '1996-11-05 17:47:30'
  AND CAST(contrib_date AS TIMESTAMP(0)) <= TIMESTAMP(0) '2010-10-21 10:54:07')
  AND amount IS NOT NULL
GROUP BY key0
ORDER BY key0
*/
child.toSQL()

parent.transform({
  type: "filter",
  expr: "recipient_party = 'R'"
})

// "SELECT * from contributions WHERE recipient_party = 'R'"
parent.toSQL()

/*
SELECT
  date_trunc(year, CAST(contrib_date AS TIMESTAMP(0))) as key0,
  AVG(amount) AS series_1
FROM contributions
WHERE
  (CAST(contrib_date AS TIMESTAMP(0)) >= TIMESTAMP(0) '1996-11-05 17:47:30'
  AND CAST(contrib_date AS TIMESTAMP(0)) <= TIMESTAMP(0) '2010-10-21 10:54:07')
  AND amount IS NOT NULL
  AND recipient_party = 'R'
GROUP BY key0
ORDER BY key0
*/
child.toSQL()

```

### Resources
* [Vega Transform](https://vega.github.io/vega/docs/transforms/)
* [Vega Architecture](http://idl.cs.washington.edu/papers/reactive-vega-architecture/)
* [Calcite Relational Algebra](https://calcite.apache.org/docs/algebra.html)
* [Crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference)
