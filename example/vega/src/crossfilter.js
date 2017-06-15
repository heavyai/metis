// @flow
import graph from "./datagraph";

const xfilterDataNode = graph.data({
  type: "data",
  source: "flights_donotmodify",
  name: "xfilter",
  transform: [
    {
      type: "crossfilter",
      signal: "vega",
      filter: []
    }
  ]
});

export function filter(id: string, filter: Object) {
  const { transform } = xfilterDataNode.getState();

  if (transform[0].type === "crossfilter") {
    const xfilters = transform[0].filter;
    const index = xfilters.findIndex(f => f.id === id);
    if (index !== -1) {
      xfilters[index] = {
        type: "filter",
        id: id,
        expr: filter.expr
      };
    } else {
      xfilters.push({
        type: "filter",
        id: id,
        expr: filter.expr
      });
    }
  }
}

function filterAll() {
  const { transform } = xfilterDataNode.getState();
  if (transform[0].type === "crossfilter") {
    transform[0].filter = [];
  }
}

export default {
  filter,
  filterAll
};
