import { createDataGraph } from "../index";
import createXFilter from "./xfilter-lite";

const connection = new MapdCon()
  .protocol("https")
  .host("metis.mapd.com")
  .port("443")
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive");

function query(stmt) {
  return new Promise((resolve, reject) => {
    return connection.query(stmt, null, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

const graph = createDataGraph({ query });

const xFilter = graph.data({
  source: "flights_donotmodify",
  name: "xfilter",
  transform: [
    {
      type: "crossfilter",
      signal: "vega",
      filter: []
    }
  ]
});

const dataRow = graph.data({
  source: "xfilter",
  name: "row",
  transform: [
    {
      type: "aggregate",
      fields: ["dest_state"],
      groupby: ["dest_state"]
    },
    {
      type: "aggregate",
      fields: ["*"],
      ops: ["count"],
      as: ["records"]
    },
    {
      type: "collect",
      sort: {
        field: "records",
        order: "descending"
      }
    },
    {
      type: "collect",
      limit: {
        row: 20
      }
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: "row"
    }
  ]
});

const dataScatter = graph.data({
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
      expr: "depdelay IS NOT NULL"
    },
    {
      type: "filter",
      expr: "arrdelay IS NOT NULL"
    },
    {
      type: "collect",
      sort: {
        field: "size",
        order: "descending"
      }
    },
    {
      type: "collect",
      limit: {
        row: 15
      }
    },
    {
      type: "resolvefilter",
      filter: { signal: "vega" },
      ignore: "scatter"
    }
  ]
});

const crossfilter = createXFilter(xFilter);

const ROW_VEGA_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 400,
  height: 400,
  padding: 5,

  signals: [
    {
      name: "filter",
      on: [{ events: "*:click", encode: "bars" }]
    }
  ],

  scales: [
    {
      name: "xscale",
      type: "band",
      domain: { data: "table", field: "dest_state" },
      range: "width"
    },
    {
      name: "yscale",
      domain: { data: "table", field: "records" },
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
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "xscale", field: "dest_state", offset: 1 },
          width: { scale: "xscale", band: 1, offset: -1 },
          y: { scale: "yscale", field: "records" },
          y2: { scale: "yscale", value: 0 }
        },
        update: {
          fill: { value: "steelblue" }
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

const SCATTER_VEGA_SPEC = {
  $schema: "https://vega.github.io/schema/vega/v3.0.json",
  width: 400,
  height: 400,
  padding: 5,
  autosize: "pad",

  signals: [
    {
      name: "filter",
      on: [{ events: "*:click", encode: "marks" }]
    }
  ],
  scales: [
    {
      name: "x",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
      domain: { data: "source", field: "x" },
      range: [0, 400]
    },
    {
      name: "y",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
      domain: { data: "source", field: "y" },
      range: [400, 0]
    },
    {
      name: "size",
      type: "linear",
      round: true,
      nice: false,
      zero: true,
      domain: { data: "source", field: "size" },
      range: [4, 361]
    },
    {
      name: "color",
      type: "ordinal",
      range: { scheme: "category10" },
      domain: { data: "source", field: "key0" }
    }
  ],

  axes: [
    {
      scale: "x",
      grid: true,
      domain: false,
      orient: "bottom",
      tickCount: 5,
      title: "x"
    },
    {
      scale: "y",
      grid: true,
      domain: false,
      orient: "left",
      titlePadding: 5,
      title: "y"
    }
  ],

  legends: [
    {
      size: "size",
      title: "size",
      format: "s",
      encode: {
        symbols: {
          update: {
            strokeWidth: { value: 2 },
            opacity: { value: 0.5 },
            stroke: { value: "#4682b4" },
            shape: { value: "circle" }
          }
        }
      }
    }
  ],

  marks: [
    {
      name: "marks",
      type: "symbol",
      from: { data: "source" },
      encode: {
        update: {
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          size: { scale: "size", field: "size" },
          shape: { value: "circle" },
          strokeWidth: { value: 2 },
          fill: { scale: "color", field: "key0" }
        }
      }
    }
  ]
};

const rowFilters = [];

function filterRow(value) {
  const index = rowFilters.findIndex(filter => filter === value);
  if (index !== -1) {
    rowFilters.splice(index, 1);
  } else {
    rowFilters.push(value);
  }
  console.log(rowFilters);
  return rowFilters;
}

function renderRow(data) {
  ROW_VEGA_SPEC.data = { name: "table", values: data };
  const runtime = vega.parse(ROW_VEGA_SPEC);
  const view = new vega.View(runtime)
    .logLevel(vega.Warn)
    .initialize(document.querySelector("#chart"))
    .renderer("svg")
    .run();

  view.addSignalListener("filter", (signal, b) => {
    const states = filterRow(b.datum.dest_state);

    if (states.length) {
      crossfilter.filter("row", {
        field: "dest_state",
        equals: states
      });
    } else {
      crossfilter.remove("row");
    }

    renderAll();
  });
}

const scatterFilters = [];

function filterScatter(value) {
  const index = scatterFilters.findIndex(filter => filter === value);
  if (index !== -1) {
    scatterFilters.splice(index, 1);
  } else {
    scatterFilters.push(value);
  }
  console.log(scatterFilters);
  return scatterFilters;
}

function renderScatter(data) {
  SCATTER_VEGA_SPEC.data = { name: "source", values: data };
  const runtime = vega.parse(SCATTER_VEGA_SPEC);
  const view = new vega.View(runtime)
    .logLevel(vega.Warn)
    .initialize(document.querySelector("#chart2"))
    .renderer("svg")
    .run();

  view.addSignalListener("filter", (signal, b) => {
    const carriers = filterScatter(b.datum.key0);
    if (carriers.length) {
      crossfilter.filter("scatter", {
        field: "carrier_name",
        equals: carriers
      });
    } else {
      crossfilter.remove("scatter");
    }

    renderAll();
  });
}

function connect() {
  return new Promise((resolve, reject) => {
    return connection.connect((error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function renderAll() {
  return Promise.all([
    dataRow.values(),
    dataScatter.values()
  ]).then(([rowData, scatterData]) => {
    renderRow(rowData);
    renderScatter(scatterData);
  });
}

connect().then(renderAll);
