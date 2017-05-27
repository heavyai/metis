import { register } from "./chart-registry";
import * as constants from "./constants";
import { rowDataNode } from "./datagraph";

const ROW_VEGA_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 350,
  height: 350,
  padding: 5,
  title: "# Records by Destination State",
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
    { orient: "bottom", scale: "xscale", title: "Destination State" },
    { orient: "left", scale: "yscale", title: "# of Records" }
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

let view = null;

function render(data) {
  ROW_VEGA_SPEC.data[0].values = data;
  const runtime = vega.parse(ROW_VEGA_SPEC);
  view = new vega.View(runtime);

  view
    .initialize(document.querySelector("#chart"))
    .logLevel(vega.Warn)
    .renderer("svg")
    .run();

  view.addSignalListener("filter", (signal, filter) => {
    this.filter({
      type: "exact",
      id: constants.ROW,
      field: "dest_state",
      filter
    });
  });
}

function redraw(data) {
  view.setState({ data: { [constants.DATA_NAME]: data } });
}

function filterAll() {
  view.setState({ data: { selected: [] } });
}

function reduceFilters(filters, filterAction) {
  if (filterAction.filter.selected) {
    const index = filters.indexOf(filterAction.filter.value);
    const nextFilters = filters.slice();
    nextFilters.splice(index, 1);
    return nextFilters;
  } else {
    return filters.concat(filterAction.filter.value);
  }
}

export default function create() {
  const chart = register(constants.ROW);
  chart.on("render", render);
  chart.on("redraw", redraw);
  chart.on("filterAll", filterAll);
  chart.data(rowDataNode);
  chart.filterReduce(reduceFilters);
}
