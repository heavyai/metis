// @flow
import { register } from "./chart-registry";
import * as constants from "./constants";
import graph from "./datagraph";

const facetLineDataNode = graph.data({
  type: "data",
  source: "xfilter",
  name: "facet",
  transform: [
    {
      type: "project",
      expr: {
        type: "extract",
        unit: "month",
        field: "arr_timestamp"
      },
      as: "key0"
    },
    {
      type: "project",
      expr: {
        type: "extract",
        unit: "hour",
        field: "arr_timestamp"
      },
      as: "key1"
    },
    {
      type: "aggregate",
      fields: ["arrdelay"],
      ops: ["sum"],
      as: ["delay"],
      groupby: ["key0", "key1"]
    },
    {
      type: "sort",
      field: ["key0", "key1"]
    },
    {
      type: "filter",
      id: "test",
      expr: "arrdelay IS NOT NULL"
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: constants.FACET_LINE
    }
  ]
});

const FACET_LINE_VEGA = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 350,
  padding: 5,

  signals: [
    { name: "rangeStep", value: 25 },
    { name: "height", update: "rangeStep * 24" }
  ],

  data: [
    {
      name: constants.DATA_NAME,
      values: []
    }
  ],

  scales: [
    {
      name: "color",
      type: "sequential",
      range: { scheme: "viridis" },
      domain: { data: constants.DATA_NAME, field: "delay" },
      zero: false,
      nice: false
    },
    {
      name: "row",
      type: "band",
      domain: [
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        0,
        1,
        2,
        3,
        4,
        5
      ],
      range: { step: { signal: "rangeStep" } }
    },
    {
      name: "x",
      type: "linear",
      zero: false,
      round: true,
      nice: true,
      domain: { data: constants.DATA_NAME, field: "key0" },
      range: "width"
    },
    {
      name: "y",
      type: "linear",
      zero: false,
      domain: { data: constants.DATA_NAME, field: "delay" },
      range: [{ signal: "rangeStep" }, 1]
    }
  ],

  axes: [
    {
      orient: "bottom",
      scale: "x",
      domain: false,
      title: "Month",
      encode: {
        labels: {
          update: {
            text: { signal: "datum.value" }
          }
        }
      }
    },
    {
      orient: "left",
      scale: "row",
      domain: false,
      title: "Hour",
      tickSize: 0,
      encode: {
        labels: {
          update: {
            text: { signal: "datum.value" }
          }
        }
      }
    }
  ],

  legends: [
    // {"fill": "color", "type": "gradient", "title": "dep_delay"}
  ],

  marks: [
    {
      type: "group",
      from: {
        facet: {
          name: "key1",
          data: constants.DATA_NAME,
          groupby: "key1"
        }
      },
      encode: {
        enter: {
          x: { value: 0 },
          y: { scale: "row", field: "key1" },
          width: { signal: "width" },
          height: { signal: "rangeStep" }
        }
      },
      marks: [
        {
          type: "area",
          from: { data: "key1" },
          encode: {
            enter: {
              x: { scale: "x", field: "key0" },
              y: { scale: "y", field: "delay" },
              y2: { signal: "rangeStep" },
              fill: { scale: "color", field: "delay" }
            }
          }
        }
      ]
    },
    {
      type: "text",
      encode: {
        enter: {
          x: { value: 0 },
          y: { value: -4 },
          text: { value: "Arrival Times Annual Delay" },
          baseline: { value: "bottom" },
          fontSize: { value: 14 },
          fontWeight: { value: "bold" },
          fill: { value: "black" }
        }
      }
    }
  ]
};

let view = null;

function render(data) {
  FACET_LINE_VEGA.data[0].values = data;
  // $FlowFixMe
  const runtime = vega.parse(FACET_LINE_VEGA);
  view = new vega.View(runtime);

  view
    .initialize(document.querySelector("#facet-line"))
    .logLevel(vega.Warn)
    .renderer("canvas")
    .run();
}

function redraw(data) {
  // $FlowFixMe
  view.setState({ data: { [constants.DATA_NAME]: data } });
}

export default function create() {
  const chart = register(constants.FACET_LINE);
  chart.on("render", render);
  chart.on("redraw", redraw);
  chart.on("filterAll", () => {});
  chart.data(facetLineDataNode);
  chart.filterReduce(() => {});
}
