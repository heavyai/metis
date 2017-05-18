import tape from "tape"
import {createDataGraph} from "../src"

tape('Data Graph Test', function (t) {
  t.test('can create data graph', function (q) {
    q.plan(3)

    const graph = createDataGraph()

    q.equal(typeof graph, "object", "graph should be object")
    q.equal(typeof graph.getState, "function", "graph should have getState method")
    q.equal(typeof graph.createDataOperator, "function", "grap should have createDataOperator method")
  })

  t.test("createDataOperator", (q) => {
    q.plan(1)

    try {
      const graph = createDataGraph()
      graph.createDataOperator()
    } catch (e) {
      q.ok(true, "trhow")
    }
  })
})
