# mapd-datagraph-sketch

## API

### Top Level

`createGraph(connector: Connector, state: GraphState): Graph`

> creates Graph object

### Graph

`.data(state: DataState): Data`

> creates a Data operator node

`.getState(): GraphState `

> returns the state of the Graph

`.nodes(): ArrayOf(Data)`

> gets all Data operator nodes

### Data

`.getState(): DataState`

> returns the state of the Data node

`.transform(transform: Transform | ArrayOf(Transform) )`

> adds a transformation or a set of transformations to the Data node

`.toSQL(): string`

> returns a representation of the data pipeline as a SQL string

`.values(): Promise`

> returns a promise that resolves to the results returned by the query

### Types

```js
type Connector {
  query: function(string): Promise
  tables: ArrayOf(string)
}

type GraphState {
  data: ArrayOf(DataState)
}

type DataState {
  source: OneOf(Connector.tables),
  name: string,
  transform: ArrayOf(Transform)
}

type Transform = Vega.Transform
// see https://github.com/vega/vega-dataflow/tree/master/definitions
```

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
