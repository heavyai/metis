// @flow
import { register } from "./chart-registry";
import * as constants from "./constants";
import graph from "./datagraph";

const lineDataNode = graph.data({
  type: "data",
  source: "xfilter",
  name: "line",
  transform: [
    {
      type: "aggregate",
      fields: ["*"],
      ops: ["count"],
      as: ["y"],
      groupby: {
        type: "project",
        expr: {
          type: "date_trunc",
          unit: "day",
          field: "dep_timestamp"
        },
        as: "x"
      }
    },
    {
      type: "sort",
      field: ["x"]
    },
    {
      type: "filter",
      id: "test",
      expr: {
        type: "between",
        field: "dep_timestamp",
        left: "TIMESTAMP(0) '1987-10-01 00:03:00'",
        right: "TIMESTAMP(0) '2008-12-31 23:59:00'"
      }
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: constants.LINE
    }
  ]
});

const LINE_VEGA_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 500,
  height: 200,
  padding: 15,
  title: "# Records by Departure Month",
  signals: [
    {
      name: "brush",
      value: [50, 150],
      on: [
        {
          events: "@overview:mousedown",
          update: "[x(), x()]"
        },
        {
          events: "[@overview:mousedown, window:mouseup] > window:mousemove!",
          update: "[brush[0], clamp(x(), 0, width)]"
        },
        {
          events: { signal: "delta" },
          update: "clampRange([anchor[0] + delta, anchor[1] + delta], 0, width)"
        }
      ]
    },
    {
      name: "anchor",
      value: null,
      on: [{ events: "@brush:mousedown", update: "slice(brush)" }]
    },
    {
      name: "xdown",
      value: 0,
      on: [{ events: "@brush:mousedown", update: "x()" }]
    },
    {
      name: "delta",
      value: 0,
      on: [
        {
          events: "[@brush:mousedown, window:mouseup] > window:mousemove!",
          update: "x() - xdown"
        }
      ]
    }
  ],

  data: [
    {
      name: constants.DATA_NAME,
      values: [],
      parse: { x: 'utc:"%Y"' }
    }
  ],

  scales: [
    {
      name: "x",
      type: "utc",
      range: "width",
      domain: { data: constants.DATA_NAME, field: "x" }
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: false,
      domain: { data: constants.DATA_NAME, field: "y" }
    }
  ],

  axes: [
    {
      orient: "bottom",
      scale: "x",
      format: "%m-%Y",
      title: "date_trunc(month, dep_timestamp)"
    },
    { orient: "left", scale: "y", title: "# of Records" }
  ],

  marks: [
    {
      type: "line",
      name: "overview",
      from: { data: constants.DATA_NAME },
      encode: {
        enter: {
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          stroke: { value: "steelblue" },
          strokeWidth: { value: 2 }
        },
        update: {
          fillOpacity: { value: 1 }
        },
        hover: {
          fillOpacity: { value: 0.5 }
        }
      }
    },
    {
      type: "rect",
      name: "brush",
      encode: {
        enter: {
          y: { value: 0 },
          height: { value: 200 },
          fill: { value: "steelblue" },
          fillOpacity: { value: 0.2 }
        },
        update: {
          x: { signal: "brush[0]" },
          x2: { signal: "brush[1]" }
        }
      }
    },
    {
      type: "rect",
      interactive: false,
      encode: {
        enter: {
          y: { value: 0 },
          height: { value: 200 },
          width: { value: 1 },
          fill: { value: "firebrick" }
        },
        update: {
          x: { signal: "brush[0]" }
        }
      }
    },
    {
      type: "rect",
      interactive: false,
      encode: {
        enter: {
          y: { value: 0 },
          height: { value: 200 },
          width: { value: 1 },
          fill: { value: "firebrick" }
        },
        update: {
          x: { signal: "brush[1]" }
        }
      }
    },
    {
      name: "bubble",
      type: "symbol",
      from: { data: constants.DATA_NAME },
      encode: {
        update: {
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          size: { value: 20 },
          shape: { value: "circle" },
          strokeWidth: { value: 2 },
          fill: { value: "steelblue" }
        }
      }
    }
  ]
};

let view = null;

function render(data) {
  LINE_VEGA_SPEC.data[0].values = data;

  const extent = [data[0].x, data[data.length - 1].x];
  // $FlowFixMe
  const scale = d3.scaleTime().domain(extent).range([0, 500]);
  // $FlowFixMe
  const runtime = vega.parse(LINE_VEGA_SPEC);
  view = new vega.View(runtime);

  view
    .initialize(document.querySelector("#chart3"))
    .logLevel(vega.Warn)
    .renderer("svg")
    .run();

  view.addSignalListener("brush", (signal, range) => {
    this.filter({
      type: "filter.range",
      id: constants.LINE,
      field: "dep_timestamp",
      filter: [scale.invert(range[0]), scale.invert(range[1])]
    });
  });
}

function redraw(data) {
  // $FlowFixMe
  view.setState({ data: { [constants.DATA_NAME]: data } });
}

function filterAll() {
  // view.setState({ data: { selected: [] } })
}

function reduceFilters(filters, { filter }) {
  // $FlowFixMe
  const formatTime = d3.timeFormat("%Y-%m-%d %-I:%M:%S");
  return [
    `TIMESTAMP(0) '${formatTime(filter[0])}'`,
    `TIMESTAMP(0) '${formatTime(filter[1])}'`
  ];
}

export default function create() {
  const chart = register(constants.LINE);
  chart.on("render", render);
  chart.on("redraw", redraw);
  chart.on("filterAll", filterAll);
  chart.data(lineDataNode);
  chart.filterReduce(reduceFilters);
}
