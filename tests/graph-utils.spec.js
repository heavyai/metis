import tape from "tape"
import {reduceNodes} from "../src/graph-utils"

const child = {
  source: "parent",
  name: "child",
  "transform": [
    {
      "type": "formula",
      "as": "key0",
      "expr": "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0)))"
    },
    {
      "type": "aggregate",
      "groupby": ["key0"],
      "fields": ["amount"],
      "ops": ["average"],
      "as": ["series_1"]
    }
  ]
 }

 const grandchild = {
  source: "child",
  name: "grandchild",
  "transform": [
    {
      "type": "formula",
      "as": "key0",
      "expr": "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0)))"
    },
    {
      "type": "aggregate",
      "groupby": ["key0"],
      "fields": ["amount"],
      "ops": ["average"],
      "as": ["series_1"]
    }
  ]
 }

const parent = {
  source: "table",
  name: "parent",
  transform: [
    {
      type: "filter",
      expr: "FILTER"
    }
  ]
}

const state = {
  parent,
  child,
  grandchild
}

tape("Reduce Nodes", (t) => {
  t.plan(3)

  t.deepEqual(reduceNodes(state, "grandchild"), {
    "source": "table",
    "transform": [
      {
        "as": "key0",
        "expr": "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0)))",
        "type": "formula"
      },
      {
        "as": [
          "series_1"
        ],
        "fields": [
          "amount"
        ],
        "groupby": [
          "key0"
        ],
        "ops": [
          "average"
        ],
        "type": "aggregate"
      },
      {
        "as": "key0",
        "expr": "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0)))",
        "type": "formula"
      },
      {
        "as": [
          "series_1"
        ],
        "fields": [
          "amount"
        ],
        "groupby": [
          "key0"
        ],
        "ops": [
          "average"
        ],
        "type": "aggregate"
      },
      {
        "expr": "FILTER",
        "type": "filter"
      }
    ]
  })

  t.deepEqual(reduceNodes(state, "child"), {
    "source": "table",
    "transform": [
      {
        "as": "key0",
        "expr": "date_trunc(year, CAST(datum.contrib_date AS TIMESTAMP(0)))",
        "type": "formula"
      },
      {
        "as": [
          "series_1"
        ],
        "fields": [
          "amount"
        ],
        "groupby": [
          "key0"
        ],
        "ops": [
          "average"
        ],
        "type": "aggregate"
      },
      {
        "expr": "FILTER",
        "type": "filter"
      }
    ]
  })

  t.deepEqual(reduceNodes(state, "parent"), {
    "source": "table",
    "transform": [
      {
        "expr": "FILTER",
        "type": "filter"
      }
    ]
  })

})
