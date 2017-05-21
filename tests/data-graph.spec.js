import tape from "tape"
import {createDataGraph} from "../src"

tape('Data Graph Test', function (t) {
  t.test('can create data graph', function (q) {
    q.plan(3)

    const graph = createDataGraph({query: ()=>{}})

    q.equal(typeof graph, "object", "graph should be object")
    q.equal(typeof graph.getState, "function", "graph should have getState method")
    q.equal(typeof graph.data, "function", "grap should have createDataNode method")
  })

  t.test("createDataNode", (q) => {
    q.plan(1)

    try {
      const graph = createDataGraph()
      graph.createDataNode()
    } catch (e) {
      q.ok(true, "trhow")
    }
  })
})
