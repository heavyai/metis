import crossfilter from "./crossfilter";
import * as constants from "./constants";

const chartRegistry = {};
const ids = [];

let redrawing = false;
let debounced = false;

export const dispatch = d3.dispatch(
  "xfilter",
  "filterAll",
  "renderAll",
  "redrawAll"
);

dispatch.on("filterAll", () => {
  crossfilter.filterAll();
  ids.forEach(id => chartRegistry[id].filterAll());
  dispatch.call("redrawAll");
});

dispatch.on("renderAll", renderAll);

dispatch.on("redrawAll", () => {
  if (redrawing) {
    debounced = true;
    return;
  } else {
    redrawing = true;
    return redrawAll().then(() => {
      redrawing = false;
      if (debounced) {
        debounced = false;
        return redrawAll();
      }
    });
  }
});

dispatch.on("xfilter", ({ type, id, field, filter }) => {
  if (type === "filter.exact") {
    crossfilter.filter(id, { type, field: field, equals: filter });
  } else if (type === "filter.range") {
    crossfilter.filter(id, { type, field: field, range: filter });
  }
  dispatch.call("redrawAll");
});

function renderAll() {
  return Promise.all(ids.map(id => chartRegistry[id].render()));
}

function redrawAll() {
  return Promise.all(ids.map(id => chartRegistry[id].redraw()));
}

export function list(id) {
  return id ? chartRegistry : chartRegistry[id];
}

export function register(id) {
  let _data = null;
  let _filters = [];
  let _filterReducer = null;

  const _dispatch = d3.dispatch("render", "redraw", "filter", "filterAll");

  _dispatch.on("filter", filterAction => {
    _filters = _filterReducer(_filters, filterAction);
    dispatch.call("xfilter", this, { ...filterAction, filter: _filters });
  });

  const chart = {
    on(event, handler) {
      _dispatch.on(event, handler);
    },
    trigger(event, context, value) {
      _dispatch.call(event, context, value);
    },
    data(data) {
      return !arguments.length ? _data : (_data = data);
    },
    render() {
      return _data.values().then(data => {
        _dispatch.call("render", chart, data);
      });
    },
    redraw() {
      return _data.values().then(data => {
        _dispatch.call("redraw", chart, data);
      });
    },
    filterReduce(reducer) {
      return !arguments.length ? _filterReducer : (_filterReducer = reducer);
    },
    filter(filterAction) {
      return !arguments.length
        ? _filters
        : _dispatch.call("filter", chart, filterAction);
    },
    filterAll() {
      _filters = [];
      _dispatch.call("filterAll", chart);
    }
  };

  ids.push(id);
  chartRegistry[id] = chart;

  return chart;
}
