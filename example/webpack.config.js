var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    app: [
      "script-loader!@mapd/connector/dist/browser-connector.js",
      "script-loader!vega/build/vega-core",
      "./index.js"
    ]
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "index.js"),
          path.resolve(__dirname, "../index.js"),
          path.resolve(__dirname, "../src")
        ],
        loader: "babel-loader"
      }
    ]
  }
};
