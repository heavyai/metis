var webpack = require("webpack");
var path = require("path");
var PROD = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./index.js",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: PROD ? "datagraph.min.js" : "datagraph.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "index.js"),
          path.resolve(__dirname, "src")
        ],
        loader: "babel-loader"
      }
    ]
  },
  plugins: PROD
    ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        })
      ]
    : []
};
