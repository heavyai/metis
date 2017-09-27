import { view, xfilterNode } from "../services";

const BAR_SPEC = {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["records"],
        groupby: "dest"
      },
      {
        type: "sort",
        field: ["records"],
        order: ["descending"]
      },
      {
        type: "filter",
        expr: {
          type: "in",
          expr: "dest",
          set: ["SFO", "JFK", "IAD", "DCA", "OAK"]
        }
      },
      {
        type: "limit",
        row: 25
      },
      {
        type: "resolvefilter",
        filter: { signal: "XFILTER" },
        ignore: "BAR"
      }
    ]
  },
  selection: {
    paintbrush: {
      type: "multi",
      encodings: ["color"]
    }
  },
  height: 300,
  mark: "bar",
  encoding: {
    y: {
      field: "dest",
      type: "ordinal",
      scale: { rangeStep: 17 }
    },
    x: {
      field: "records",
      type: "quantitative",
      axis: { title: "# Records" }
    },
    color: {
      condition: {
        selection: "paintbrush",
        field: "dest",
        type: "nominal"
      },
      value: "grey"
    }
  }
};

export const dispatch = view.dispatch();

function handleSelect(values) {
  xfilterNode.transform(transforms => {
    transforms[0].filter.BAR = {
      type: "filter",
      expr: {
        type: "in",
        expr: "dest",
        set: values
      }
    };
    return transforms;
  });
}

dispatch.on("setup.vega", function setup() {
  this.state = BAR_SPEC;
  this.dataNode = xfilterNode.data({
    name: "line",
    transform: this.state.data.transform
  });
});

dispatch.on("postRender", function postRender() {
  this.vegaView.addEventListener("click", () => {
    this.vegaView.getState({
      data: (data, values) => {
        if (data === "paintbrush_store") {
          const selected = values.values.value;
          handleSelect(
            selected.length ? selected.map(v => v.values[0]) : selected
          );
          dispatch.call("filter", this);
        }
      }
    });
  });
});
