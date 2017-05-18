import tape from "tape"
import {createDataGraph} from "../src"

tape("Data Operator", (t) => {
  t.test("has api", (q) => {
    const graph = createDataGraph()
    const data = graph.createDataOperator({
      name: "test",
      source: "table"
    })

    q.plan(3)
    q.equal(typeof data, "object")
    q.equal(typeof data.getState, "function")
    q.equal(typeof data.transform, "function")
  })

  t.test("transform method", (q) => {
    const graph = createDataGraph()
    const data = graph.createDataOperator({
      name: "test",
      source: "table"
    })

    const transformArray = [
      {type: "filter", expr: "custom"},
      {type: "filter", expr: "custom"},
    ]

    data.transform(transformArray)

    q.plan(1)
    q.deepEqual(data.getState(), {
      name: "test",
      source: "table",
      transform: transformArray
    })
  })

  t.test("toSQL method", (q) => {
    const graph = createDataGraph()
    const data = graph.createDataOperator({
      name: "test",
      source: "contributions",
      transform: [
        {type: "filter", expr: "recipient_party = 'R'"},
        {type: "filter", expr: "amount > 1000"},
      ]
    })

    q.plan(1)
    q.equal(data.toSQL(), "SELECT * from contributions WHERE recipient_party = 'R' AND amount > 1000")
  })
})
