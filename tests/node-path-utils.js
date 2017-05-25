import tape from "tape"
import {reduceNodes, resolveFilters, nodePathToSQL} from "../src/node-path-utils"

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

tape("resolveFilters", assert => {
  assert.plan(1)
  assert.deepEqual(resolveFilters({
    source: "parent",
    name: "child",
    "transform": [
      {
        type: "aggregate",
        groupby: ["dest_city"],
        fields: ["depdelay"],
        ops: ["average"],
        as: ["val"]
      },
      {
        type: "crossfilter",
        signal: "group",
        filter: [
          {
            type: "filter",
            id: "pie",
            expr: "recipient_party = 'D'"
          },
          {
            type: "filter",
            id: "row",
            expr: "recipient_party = 'R'"
          },
          {
            type: "filter",
            id: "bubble",
            expr: "recipient_party = 'I'"
          }
        ]
      },
      {
        type: "resolvefilter",
        filter: {signal: "group"},
        ignore: ["bubble"]
      }
    ]
   }), {
    source: "parent",
    name: "child",
    transform: [
      {
        type: "aggregate",
        groupby: ["dest_city"],
        fields: ["depdelay"],
        ops: ["average"],
        as: ["val"]
      },
      {
        type: "filter",
        id: "pie",
        expr: "recipient_party = 'D'"
      },
      {
        type: "filter",
        id: "row",
        expr: "recipient_party = 'R'"
      }
    ]
  })
})
