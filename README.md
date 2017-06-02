# sql-datagraph &middot; [![Build Status](https://travis-ci.com/mapd/mapd-data-layer.svg?token=PevoQNBcptry9Dnrqejy&branch=master)](https://travis-ci.com/mapd/mapd-data-layer) [![codecov](https://codecov.io/gh/mapd/mapd-data-layer/branch/master/graph/badge.svg?token=J68Anjg8je)](https://codecov.io/gh/mapd/mapd-data-layer)

* [**API Documentation**](docs/API.md)
* [**Crossfiltering Vega Example**](https://mapd.github.io/mapd-data-layer/example/)

Declaratively build SQL data pipelines. Based on the [Vega Transform API](https://vega.github.io/vega/docs/transforms/).

Each node in the graph represents a transformation of data. Root nodes are "scans" of SQL tables.

The path from a child node to its root represents a data transformation pipeline. This pipeline can be described as a SQL query or a set of transformations described in JSON notation.


# Example

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

# Prior Art
* [Vega Transform](https://vega.github.io/vega/docs/transforms/)
* [Vega Architecture](http://idl.cs.washington.edu/papers/reactive-vega-architecture/)
* [Calcite Relational Algebra](https://calcite.apache.org/docs/algebra.html)
* [Crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference)

# License

This project is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

# Contributing

In order to clarify the intellectual property license granted with Contributions from any person or entity, MapD must have a Contributor License Agreement ("CLA") on file that has been signed by each Contributor, indicating agreement to the [Contributor License Agreement](CLA.md). If you have not already done so, please complete and sign, then scan and email a pdf file of this Agreement to [contributors@mapd.com](mailto:contributors@mapd.com). Please read the agreement carefully before signing and keep a copy for your records.
