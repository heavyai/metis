var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    app: [
      "script-loader!@mapd/connector/dist/browser-connector.js",
      "script-loader!d3/build/d3.min.js",
      "script-loader!vega/build/vega.min.js",
      "script-loader!vega-lite/build/vega-lite.min.js",
      "./index.js"
    ]
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "assets"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "index.js"),
          path.resolve(__dirname, "./src"),
          path.resolve(__dirname, "../config.js"),
          path.resolve(__dirname, "../../packages/thrift-layer"),
          path.resolve(__dirname, "../../packages/data-layer"),
          path.resolve(__dirname, "../../packages/view-layer")
        ],
        loader: "babel-loader"
      }
    ]
  }
};
