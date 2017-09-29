import { view, xfilterNode } from "./services";
import * as utils from "./stack-utils";

export const dispatch = view.dispatch();

const STACKS = ["en", "fr", "es", "it"];

const dataTransforms = [
  {
    type: "aggregate",
    fields: ["*"],
    ops: ["count"],
    as: ["val"],
    groupby: [
      {
        type: "project",
        expr: {
          type: "extract",
          unit: "hour",
          field: "tweet_time"
        },
        as: "key0"
      },
      {
        type: "project",
        expr: {
          type: "case",
          cond: [
            [
              {
                type: "in",
                expr: "lang",
                set: STACKS
              },
              "lang"
            ]
          ],
          else: "other"
        },
        as: "key1"
      }
    ]
  },
  {
    type: "sort",
    field: ["key0"]
  },
  {
    type: "resolvefilter",
    filter: { signal: "XFILTER" },
    ignore: ["BAR.lang", "BAR.extract"]
  }
];
function filterTransform(lang, extract) {
  return function transform(transforms) {
    if (lang.length) {
      transforms[0].filter["BAR.lang"] = {
        type: "filter",
        expr: {
          type: "in",
          expr: "lang",
          set: [...new Set(lang)]
        }
      };
    } else {
      delete transforms[0].filter["BAR.lang"];
    }

    if (extract.length) {
      transforms[0].filter["BAR.extract"] = {
        type: "filter",
        expr: {
          type: "in",
          expr: "extract(hour from tweet_time)",
          set: [...new Set(extract)]
        }
      };
    } else {
      delete transforms[0].filter["BAR.extract"];
    }

    return transforms;
  };
}

function filterHandler(chart) {
  const filters = chart.filters().map(f => f.split("x")[1]);
  const extract = chart.filters().map(f => parseInt(f.split("x")[0]));
  xfilterNode.transform(filterTransform(filters, extract));
  dispatch.call("filter", this);
}

dispatch.on("preRender", function(data) {
  const preparedData = utils.prepareDataForStack(data);
  STACKS.forEach((stack, index) => {
    utils.prepareStack(this.chart, stack, preparedData, index);
  });
});

dispatch.on("preRedraw", function(data) {
  const preparedData = utils.prepareDataForStack(data);
  STACKS.forEach((stack, index) => {
    utils.prepareStack(this.chart, stack, preparedData, index);
  });
});
dispatch.on("setup", function setup() {
  this.chart = dc.barChart("#chart2");
  this.dataNode = xfilterNode.data({
    name: "stacked",
    transform: dataTransforms
  });

  this.chart
    ._mandatoryAttributes([])
    .controlsUseVisibility(true)
    .width(400)
    .height(320)
    .x(d3.scale.linear().domain([1, 21]))
    .margins({ left: 80, top: 20, right: 10, bottom: 20 })
    .brushOn(false)
    .keyAccessor(a => a.key);

  this.chart.legend(dc.legend());
  this.chart.fadeDeselectedArea = utils.fadeDeselectedAreaOverride.bind(this);
  this.chart.on("pretransition", utils.handleBarSelection);

  this.chart.on("filtered", filterHandler.bind(this));
});
