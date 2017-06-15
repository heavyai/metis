// @flow
import { register } from "./chart-registry";
import * as constants from "./constants";
import graph from "./datagraph";

const scatterDataNode = graph.data({
  type: "data",
  source: "xfilter",
  name: "scatter",
  transform: [
    {
      type: "aggregate",
      fields: ["carrier_name"],
      as: ["key0"],
      groupby: "key0"
    },
    {
      type: "aggregate",
      fields: ["depdelay", "arrdelay", "*"],
      as: ["x", "y", "size"],
      ops: ["average", "average", "count"]
    },
    {
      type: "filter",
      id: "test",
      expr: "depdelay IS NOT NULL"
    },
    {
      type: "filter",
      id: "test",
      expr: "arrdelay IS NOT NULL"
    },
    {
      type: "sort",
      field: ["size"],
      order: ["descending"]
    },
    {
      type: "limit",
      row: 12
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: constants.SCATTER
    }
  ]
});

const SCATTER_VEGA_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 250,
  height: 250,
  padding: 5,
  autosize: "pad",
  title: "Average Arrival and Departure Delay by Carrier Name",
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
          events: "@bubble:click",
          update: "{value: datum.key0, selected: indata('selected', 'value', datum.key0)}",
          force: true
        }
      ]
    },
    {
      name: "clicked",
      value: null,
      on: [
        {
          events: "@bubble:click",
          update: "{value: datum.key0}",
          force: true
        }
      ]
    }
  ],
  scales: [
    {
      name: "x",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
      domain: { data: constants.DATA_NAME, field: "x" },
      range: [0, 250]
    },
    {
      name: "y",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
      domain: { data: constants.DATA_NAME, field: "y" },
      range: [250, 0]
    },
    {
      name: "size",
      type: "linear",
      round: true,
      nice: false,
      zero: true,
      domain: { data: constants.DATA_NAME, field: "size" },
      range: [4, 361]
    },
    {
      name: "color",
      type: "ordinal",
      range: { scheme: "category10" },
      domain: { data: constants.DATA_NAME, field: "key0" }
    }
  ],

  axes: [
    {
      scale: "x",
      grid: true,
      domain: false,
      orient: "bottom",
      tickCount: 5,
      title: "AVG(depdelay)"
    },
    {
      scale: "y",
      grid: true,
      domain: false,
      orient: "left",
      titlePadding: 5,
      title: "AVG(arrdelay)"
    }
  ],

  legends: [
    // {
    //   size: "size",
    //   title: "size",
    //   format: "s",
    //   encode: {
    //     symbols: {
    //       update: {
    //         strokeWidth: { value: 2 },
    //         opacity: { value: 0.5 },
    //         stroke: { value: "#4682b4" },
    //         shape: { value: "circle" }
    //       }
    //     }
    //   }
    // }
  ],

  marks: [
    {
      name: "bubble",
      type: "symbol",
      from: { data: constants.DATA_NAME },
      encode: {
        update: {
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          size: { scale: "size", field: "size" },
          shape: { value: "circle" },
          strokeWidth: { value: 2 },
          fill: [
            {
              test: "!length(data('selected')) || indata('selected', 'value', datum.key0)",
              scale: "color",
              field: "key0"
            },
            { value: "#D3D3D3" }
          ]
        }
      }
    }
  ]
};

// function handleFilterSignal(signal, filter) {
//   dispatch.call("filter", this, {
//     type: "exact",
//     id: constants.SCATTER,
//     field: "carrier_name",
//     filter
//   });
// }
//
// export function render(data) {
//   SCATTER_VEGA_SPEC.data[0].values = data;
//   const runtime = vega.parse(SCATTER_VEGA_SPEC);
//   const view = new vega.View(runtime);
//   dispatch.call("render", view, { id: constants.SCATTER, node: "#chart2" });
//   view.addSignalListener("filter", handleFilterSignal);
// }

let view = null;

function render(data) {
  SCATTER_VEGA_SPEC.data[0].values = data;
  // $FlowFixMe
  const runtime = vega.parse(SCATTER_VEGA_SPEC);
  view = new vega.View(runtime);

  view
    .initialize(document.querySelector("#chart2"))
    .logLevel(vega.Warn)
    .renderer("svg")
    .run();

  view.addSignalListener("filter", (signal, filter) => {
    this.filter({
      type: "filter.exact",
      id: constants.SCATTER,
      field: "carrier_name",
      filter
    });
  });
}

function redraw(data) {
  // $FlowFixMe
  view.setState({ data: { [constants.DATA_NAME]: data } });
}

function filterAll() {
  // $FlowFixMe
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
  const chart = register(constants.SCATTER);
  chart.on("render", render);
  chart.on("redraw", redraw);
  chart.on("filterAll", filterAll);
  chart.data(scatterDataNode);
  chart.filterReduce(reduceFilters);
}
