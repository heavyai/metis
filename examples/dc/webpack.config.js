var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    app: [
      `script-loader!${path.resolve(
        __dirname,
        "node_modules",
        "@mapd/connector/dist/browser-connector.js"
      )}`,
      `script-loader!${path.resolve(__dirname, "node_modules", "d3/d3.js")}`,
      `script-loader!${path.resolve(__dirname, "node_modules", "dc/dc.js")}`,
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
