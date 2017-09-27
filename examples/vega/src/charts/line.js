import { view, xfilterNode } from "../services";
import * as utils from "../utils"

const LINE_SPEC = {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["val"],
        groupby: [
          {
            type: "project",
            expr: {
              type: "date_trunc",
              unit: "day",
              field: "dep_timestamp"
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
                    expr: "dest",
                    set: ["SFO", "JFK", "IAD", "DCA", "OAK"]
                  },
                  "dest"
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
        filter: { signal: "XFILTER" },
        ignore: "LINE"
      }
    ]
  },
  transform: [
    {
      filter: "datum.key1 != 'other'"
    }
  ],
  vconcat: [
    {
      width: 480,
      mark: "line",
      selection: {
        filter: { type: "interval", encodings: ["x"] }
      },
      encoding: {
        x: {
          field: "key0",
          type: "temporal",
          scale: { domain: { selection: "brush" } },
          axis: { title: "", labelAngle: 0, format: "%-m/%-d/%Y", grid: false }
        },
        y: { field: "val", type: "quantitative", scale: { zero: false } },
        color: {
          field: "key1",
          type: "nominal"
        }
      }
    },
    {
      width: 480,
      height: 100,
      mark: "line",
      selection: {
        brush: { type: "interval", encodings: ["x"] }
      },
      encoding: {
        x: {
          field: "key0",
          type: "temporal",
          axis: { labelAngle: 0, grid: false }
        },
        y: {
          field: "val",
          type: "quantitative",
          axis: { tickCount: 3, grid: false },
          scale: { zero: false }
        },
        color: {
          field: "key1",
          type: "nominal"
        }
      }
    }
  ]
};

export const dispatch = view.dispatch();

function handleLineBrush() {
  this.vegaView.getState({
    data: (data, values) => {
      if (data === "filter_store") {
        const extent = utils.getExtent(values);
        if (extent) {
          xfilterNode.transform(transforms => {
            transforms[0].filter.LINE = {
              type: "filter",
              expr: {
                type: "between",
                field: "dep_timestamp",
                left: `TIMESTAMP(0) '${utils.formatTime(extent[0])}'`,
                right: `TIMESTAMP(0) '${utils.formatTime(extent[1])}'`
              }
            };
            return transforms;
          });
          dispatch.call("filter", this);
        }
      }
    }
  });
}

dispatch.on("setup.vega", function setup() {
  this.state = LINE_SPEC;
  this.dataNode = xfilterNode.data({
    name: "line",
    transform: this.state.data.transform
  });
});

dispatch.on("postRender", function postRender() {
  this.vegaView.addSignalListener("filter_x", handleLineBrush.bind(this));
});
