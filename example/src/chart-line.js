import { dispatch } from "./chart-registry";
import * as constants from "./constants";

const LINE_VEGA_SPEC = {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "width": 500,
  "height": 200,
  "padding": 5,

  "signals": [

  ],

  "data": [
    {
      "name": "table",
      "values": []
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "point",
      "range": "width",
      "domain": {"data": "table", "field": "x"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "table", "field": "y"}
    }
  ],

  "axes": [
    {"orient": "bottom", "scale": "x"},
    {"orient": "left", "scale": "y"}
  ],

  "marks": [
    {
      "type": "line",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "field": "y"},
          "stroke": {"value": "steelblue"},
          "strokeWidth": {"value": 2}
        },
        "update": {
          "fillOpacity": {"value": 1}
        },
        "hover": {
          "fillOpacity": {"value": 0.5}
        }
      }
    }
  ]
}

export function render(data) {
  LINE_VEGA_SPEC.data[0].values = data;
  const runtime = vega.parse(LINE_VEGA_SPEC);
  const view = new vega.View(runtime);
  dispatch.call("render", view, { id: constants.LINE, node: "#chart3" });
}
