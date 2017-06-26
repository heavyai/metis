import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

var env = process.env.NODE_ENV;
var config = {
  format: "umd",
  moduleName: "DataGraph",
  plugins: [
    babel({
      plugins: ["external-helpers"]
    }),
    resolve({
      main: true,
      jsnext: true
    }),
    commonjs()
  ]
};

if (env === "production") {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
