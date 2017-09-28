var webpack = require("webpack");
var path = require("path");

const modulePath = dir => path.resolve(__dirname, "node_modules", dir)

module.exports = {
  entry: {
    app: [
      `script-loader!${modulePath("d3/build/d3.min.js")}`,
      `script-loader!${modulePath("vega/build/vega.min.js")}`,
      `script-loader!${modulePath("vega-lite/build/vega-lite.min.js")}`,
      path.resolve(__dirname, "index.js")
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
        exclude: [
          path.resolve(__dirname, "../../packages/thrift-layer/lib"),
        ],
        loader: "babel-loader"
      }
    ]
  }
};
