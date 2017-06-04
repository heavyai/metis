import { register } from "./chart-registry";
import * as constants from "./constants";
import graph from "./datagraph";

const parallelDataNode = graph.data({
  source: "xfilter",
  name: "parallel",
  transform: [
    {
      type: "aggregate",
      fields: ["dest_city"],
      as: ["name"],

      groupby: "name"
    },
    {
      type: "aggregate",
      fields: [
        "*",
        "arrdelay",
        "depdelay",
        "weatherdelay",
        "securitydelay",
        "carrierdelay"
      ],
      ops: ["count", "average", "average", "average", "average", "average"],
      as: ["a", "b", "c", "d", "e", "f"]
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: ""
    }
  ]
});

const PARALLEL_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 500,
  height: 400,
  padding: 5,

  config: {
    axisY: {
      titleX: -2,
      titleY: 410,
      titleAngle: 0,
      titleAlign: "right",
      titleBaseline: "top"
    }
  },

  data: [
    {
      name: constants.DATA_NAME,
      values: []
    },
    {
      name: "fields",
      values: ["a", "b", "c", "d", "e", "f"]
    }
  ],

  scales: [
    {
      name: "ord",
      type: "point",
      range: "width",
      round: true,
      domain: { data: "fields", field: "data" }
    },
    {
      name: "a",
      type: "linear",
      range: "height",
      zero: false,
      nice: true,
      domain: { data: constants.DATA_NAME, field: "a" }
    },
    {
      name: "b",
      type: "linear",
      range: "height",
      zero: false,
      nice: true,
      domain: { data: constants.DATA_NAME, field: "b" }
    },
    {
      name: "c",
      type: "linear",
      range: "height",
      zero: false,
      nice: true,
      domain: { data: constants.DATA_NAME, field: "c" }
    },
    {
      name: "d",
      type: "linear",
      range: "height",
      zero: false,
      nice: true,
      domain: { data: constants.DATA_NAME, field: "d" }
    },
    {
      name: "e",
      type: "linear",
      range: "height",
      zero: false,
      nice: true,
      domain: { data: constants.DATA_NAME, field: "e" }
    },
    {
      name: "f",
      type: "linear",
      range: "height",
      zero: false,
      nice: true,
      domain: { data: constants.DATA_NAME, field: "f" }
    }
  ],

  axes: [
    {
      orient: "left",
      zindex: 1,
      scale: "a",
      title: "# Records",
      offset: { scale: "ord", value: "a", mult: -1 }
    },
    {
      orient: "left",
      zindex: 1,
      scale: "b",
      title: "Arrival_delay",
      offset: { scale: "ord", value: "b", mult: -1 }
    },
    {
      orient: "left",
      zindex: 1,
      scale: "c",
      title: "Dep_delay",
      offset: { scale: "ord", value: "c", mult: -1 }
    },
    {
      orient: "left",
      zindex: 1,
      scale: "d",
      title: "Weather_delay",
      offset: { scale: "ord", value: "d", mult: -1 }
    },
    {
      orient: "left",
      zindex: 1,
      scale: "e",
      title: "Security_delay",
      offset: { scale: "ord", value: "e", mult: -1 }
    },
    {
      orient: "left",
      zindex: 1,
      scale: "f",
      title: "Carroer_delay",
      offset: { scale: "ord", value: "f", mult: -1 }
    }
  ],

  marks: [
    {
      type: "group",
      from: { data: constants.DATA_NAME },
      marks: [
        {
          type: "line",
          from: { data: "fields" },
          encode: {
            enter: {
              x: { scale: "ord", field: "data" },
              y: {
                scale: { datum: "data" },
                field: { parent: { datum: "data" } }
              },
              stroke: { value: "steelblue" },
              strokeWidth: { value: 1.01 },
              strokeOpacity: { value: 0.3 }
            }
          }
        }
      ]
    }
  ]
};

let view = null;

function render(data) {
  PARALLEL_SPEC.data[0].values = data;
  const runtime = vega.parse(PARALLEL_SPEC);
  view = new vega.View(runtime);

  view
    .initialize(document.querySelector("#parallel-line"))
    .logLevel(vega.Warn)
    .renderer("canvas")
    .run();

  view.addSignalListener("brush", (a, b) => console.log(b));
}

function redraw(data) {
  view.setState({ data: { [constants.DATA_NAME]: data } });
}

export default function create() {
  const chart = register("PARALLEL");
  chart.on("render", render);
  chart.on("redraw", redraw);
  chart.on("filterAll", () => {});
  chart.data(parallelDataNode);
  chart.filterReduce(() => {});
}
