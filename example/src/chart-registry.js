import { rowDataNode, scatterDataNode, lineDataNode } from "./datagraph";
import crossfilter from "./crossfilter";
import * as Row from "./chart-row";
import * as Line from "./chart-line";
import * as Scatter from "./chart-scatter";
import * as constants from "./constants";

const formatTime = d3.timeFormat("%Y-%m-%d %-I:%M:%S");

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
  return Promise.all([
    rowDataNode.values(),
    scatterDataNode.values(),
    lineDataNode.values()
  ]);
}

function renderAll() {
  return dataAsync().then(([rowData, scatterData, a]) => {
    Row.render(rowData);
    Scatter.render(scatterData);
    Line.render(a);
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
  if (type === "exact") {
    const state = filters[id];
    if (filter.selected) {
      const index = state.indexOf(filter.value);
      state.splice(index, 1);
    } else {
      state.push(filter.value);
    }
    crossfilter.filter(id, { field, equals: state });
  } else if (type === "range") {
    filters[id] = filter;
    var range = [
      `TIMESTAMP(0) '${formatTime(filters[id][0])}'`,
      `TIMESTAMP(0) '${formatTime(filters[id][1])}'`
    ];
    crossfilter.filter(id, { field, range });
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
