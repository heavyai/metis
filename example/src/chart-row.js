import { dispatch } from "./chart-registry";
import * as constants from "./constants";

const ROW_VEGA_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 400,
  height: 400,
  padding: 5,

  data: [
    { name: constants.DATA_NAME, values: [] },
    {
      name: "selected",
      on: [{ trigger: "clicked", toggle: "clicked" }]
    }
  ],

  signals: [
    {
      name: "filter",
      value: null,
      on: [
        {
          events: "@bars:click",
          update: "{value: datum.dest_state, selected: indata('selected', 'value', datum.dest_state)}",
          force: true
        }
      ]
    },
    {
      name: "clicked",
      value: null,
      on: [
        {
          events: "@bars:click",
          update: "{value: datum.dest_state}",
          force: true
        }
      ]
    }
  ],

  scales: [
    {
      name: "xscale",
      type: "band",
      domain: { data: constants.DATA_NAME, field: "dest_state" },
      range: "width"
    },
    {
      name: "yscale",
      domain: { data: constants.DATA_NAME, field: "records" },
      nice: true,
      range: "height"
    }
  ],

  axes: [
    { orient: "bottom", scale: "xscale" },
    { orient: "left", scale: "yscale" }
  ],

  marks: [
    {
      type: "rect",
      name: "bars",
      interactive: true,
      from: { data: constants.DATA_NAME },
      encode: {
        enter: {
          x: { scale: "xscale", field: "dest_state", offset: 1 },
          width: { scale: "xscale", band: 1, offset: -1 },
          y: { scale: "yscale", field: "records" },
          y2: { scale: "yscale", value: 0 }
        },
        update: {
          fill: [
            {
              test: "!length(data('selected')) || indata('selected', 'value', datum.dest_state)",
              value: "steelblue"
            },
            { value: "#D3D3D3" }
          ]
        },
        hover: {
          fill: { value: "red" }
        }
      }
    },
    {
      type: "text",
      encode: {
        enter: {
          align: { value: "center" },
          baseline: { value: "bottom" },
          fill: { value: "#333" }
        }
      }
    }
  ]
};

function handleFilterSignal(signal, filter) {
  dispatch.call("filter", this, {
    type: "exact",
    id: constants.ROW,
    field: "dest_state",
    filter
  });
}

export function render(data) {
  ROW_VEGA_SPEC.data[0].values = data;
  const runtime = vega.parse(ROW_VEGA_SPEC);
  const view = new vega.View(runtime);
  dispatch.call("render", view, { id: constants.ROW, node: "#chart" });
  view.addSignalListener("filter", handleFilterSignal);
}
