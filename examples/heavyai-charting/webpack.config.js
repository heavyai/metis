var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    app: [
      "script-loader!@heavyai/connector/dist/browser-connector.js",
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
          path.resolve(__dirname, "../../src"),
          path.resolve(__dirname, "../../index.js"),
          path.resolve(__dirname, "index.js"),
          path.resolve(__dirname, "./src"),
          path.resolve(__dirname, "node_modules/@heavyai/charting")
        ],
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  }
};
