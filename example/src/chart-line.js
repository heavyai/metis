import { dispatch } from "./chart-registry";
import * as constants from "./constants";

const LINE_VEGA_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 500,
  height: 200,
  padding: 5,
  signals: [
    {
      name: "brush",
      value: [50, 200],
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
      name: "table",
      values: [],
      parse: { x: 'utc:"%Y"' }
    }
  ],

  scales: [
    {
      name: "x",
      type: "utc",
      range: "width",
      domain: { data: "table", field: "x" }
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: { data: "table", field: "y" }
    }
  ],

  axes: [
    { orient: "bottom", scale: "x", format: "%m-%Y" },
    { orient: "left", scale: "y" }
  ],

  marks: [
    {
      type: "line",
      name: "overview",
      from: { data: "table" },
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
      from: { data: "table" },
      encode: {
        update: {
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          size: { value: 20 },
          shape: { value: "circle" },
          strokeWidth: { value: 2 },
          fill: { value: "red" }
        }
      }
    }
  ]
};

export function render(data) {
  LINE_VEGA_SPEC.data[0].values = data;
  const runtime = vega.parse(LINE_VEGA_SPEC);
  const view = new vega.View(runtime);
  dispatch.call("render", view, { id: constants.LINE, node: "#chart3" });

  const extent = [data[0].x, data[data.length - 1].x];
  const scale = d3.scaleTime().domain(extent).range([0, 500]);

  view.addSignalListener("brush", (signal, range) => {
    dispatch.call("filter", this, {
      type: "range",
      id: constants.LINE,
      field: "dep_timestamp",
      filter: [scale.invert(range[0]), scale.invert(range[1])]
    });
  });
}
