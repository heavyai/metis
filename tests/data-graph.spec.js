// @flow
import tape from "tape";
import createDataGraph from "../src/create-data-graph";

tape("Data Graph API", assert => {
  assert.plan(6);

  const graph = createDataGraph({
    query: () => Promise.resolve([]),
    tables: []
  });

  assert.equal(typeof graph, "object", "should be an object");

  assert.equal(
    typeof graph.registerParser,
    "function",
    "should have a registerParser method"
  );

  assert.equal(
    typeof graph.children,
    "function",
    "should have a children method"
  );

  assert.equal(typeof graph.data, "function", "should have a data method");

  assert.equal(graph.children().length, 0, "should initially have no children");

  graph.data({
    name: "test",
    source: "test"
  });

  assert.equal(
    graph.children().length,
    1,
    "should be able to create chilren through .data() method"
  );

  tape("Data Node API", assert => {
    assert.plan(7);
    const rootNode = graph.children()[0];

    assert.equal(typeof rootNode, "object", "should be an object");

    assert.equal(
      typeof rootNode.toSQL,
      "function",
      "should have a toSQL method"
    );

    assert.equal(
      typeof rootNode.getState,
      "function",
      "should have a getState method"
    );

    assert.equal(typeof rootNode.data, "function", "should have a data method");

    assert.equal(
      typeof rootNode.values,
      "function",
      "should have a values method"
    );

    assert.equal(
      typeof rootNode.transform,
      "function",
      "should have a transform method"
    );

    assert.deepEqual(
      rootNode.getState(),
      {
        type: "root",
        source: "test",
        transform: [],
        children: []
      },
      "should have the correct initial state"
    );

    const child = rootNode.data({ name: "child" });

    tape("Data Node .data() method", assert => {
      assert.plan(2);

      assert.deepEqual(
        rootNode.getState().children,
        [child],
        "should set child in children array when created"
      );

      assert.deepEqual(
        child.getState(),
        {
          type: "data",
          source: rootNode,
          transform: [],
          children: []
        },
        "should create child with correct initial state"
      );
    });

    tape("Data Node .transform() method", assert => {
      assert.plan(2);

      child.transform([
        { type: "filter", id: "test", expr: "custom" },
        { type: "filter", id: "test", expr: "custom" }
      ]);

      assert.deepEqual(child.getState().transform, [
        { type: "filter", id: "test", expr: "custom" },
        { type: "filter", id: "test", expr: "custom" }
      ]);

      child.transform(transform =>
        transform.map(t =>
          Object.assign({}, t, {
            expr: "test"
          })
        )
      );

      // $FlowFixMe
      child.transform(""); // this is just to test the else block

      assert.deepEqual(child.getState().transform, [
        { type: "filter", id: "test", expr: "test" },
        { type: "filter", id: "test", expr: "test" }
      ]);
    });

    tape("Data Node .toSQL() method", assert => {
      assert.plan(2);

      assert.equal(rootNode.toSQL(), "SELECT * FROM test");

      assert.equal(child.toSQL(), "SELECT * FROM test WHERE (test) AND (test)");
    });
  });
});
