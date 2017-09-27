import {view, xfilterNode} from "./services"

export const dispatch = view.dispatch();

const dataTransforms = [
  {
    type: "aggregate",
    fields: ["*"],
    ops: ["count"],
    as: ["records"],
    groupby: "country"
  },
  {
    type: "sort",
    field: ["records"],
    order: ["descending"]
  },
  {
    type: "limit",
    row: 10
  },
  {
    type: "resolvefilter",
    filter: { signal: "XFILTER" },
    ignore: "PIE"
  }
]

function filterHandler (chart) {
  const filters = chart.filters()
  xfilterNode.transform(transforms => {
    if (filters.length) {
      transforms[0].filter["PIE"] = {
        type: "filter",
        expr: {
          type: "in",
          expr: "country",
          set: [...new Set(filters)]
        }
      };
    } else {
      delete transforms[0].filter["PIE"]
    }

    return transforms;
  });
  dispatch.call("filter", this)
}

dispatch.on("preRedraw", function preRender(data) {
  this.chart.data(() => data);
});

dispatch.on("preRender", function preRender(data) {
  this.chart.data(() => data);
});

dispatch.on("setup", function setup() {
  this.chart = dc
    .pieChart("#chart")
    ._mandatoryAttributes([])
    .width(768)
    .height(480)
    .slicesCap(4)
    .innerRadius(100)
    .colorAccessor(d => d.country)
    .keyAccessor(d => d.country)
    .valueAccessor(p => p.records);

  this.chart.on("filtered", filterHandler.bind(this))

  this.dataNode = xfilterNode.data({
    name: "pie",
    transform: dataTransforms
  });
});
