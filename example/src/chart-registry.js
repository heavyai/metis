import { rowDataNode, scatterDataNode, lineDataNode } from "./datagraph";
import crossfilter from "./crossfilter";
import * as Row from "./chart-row";
import * as Line from "./chart-line";
import * as Scatter from "./chart-scatter";
import * as constants from "./constants";

const filters = {
  [constants.ROW]: [],
  [constants.SCATTER]: []
};

const views = {
  [constants.ROW]: null,
  [constants.SCATTER]: null
};

export const dispatch = d3.dispatch(
  "render",
  "redraw",
  "filter",
  "filterAll",
  "renderAll",
  "redrawAll"
);

function dataAsync() {
  return Promise.all([rowDataNode.values(), scatterDataNode.values(), lineDataNode.values()]);
}

function renderAll() {
  return dataAsync().then(([rowData, scatterData, a]) => {
    Row.render(rowData);
    Scatter.render(scatterData);
    Line.render(a)
  });
}

function redrawAll() {
  return dataAsync().then(([rowData, scatterData]) => {
    dispatch.call("redraw", views[constants.SCATTER], scatterData);
    dispatch.call("redraw", views[constants.ROW], rowData);
  });
}

dispatch.on("redraw", function(data) {
  this.setState({ data: { [constants.DATA_NAME]: data } });
});

dispatch.on("render", function({ id, node }) {
  views[id] = this;
  this.initialize(document.querySelector(node))
    .logLevel(vega.Warn)
    .renderer("svg")
    .run();
});

dispatch.on("filter", ({ id, type, field, filter }) => {
  const state = filters[id];
  if (type === "exact") {
    if (filter.selected) {
      const index = state.indexOf(filter.value);
      state.splice(index, 1);
    } else {
      state.push(filter.value);
    }
    crossfilter.filter(id, { field, equals: state });
  } else if (Array.isArray(value)) {
    filters[id] = value;
    // crossfilter.filterRange(id, value)
  }

  redrawAll();
});

dispatch.on("filterAll", () => {
  Object.keys(filters).forEach(key => (filters[key] = []));
  crossfilter.filterAll();
  views[constants.ROW].setState({ data: { selected: [] } });
  views[constants.SCATTER].setState({ data: { selected: [] } });
  redrawAll();
});

dispatch.on("renderAll", renderAll);
dispatch.on("redrawAll", redrawAll);
