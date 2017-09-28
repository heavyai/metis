require("./lib/thrift.js")
require("./lib/mapd_types.js")
require("./lib/mapd.thrift.js")

window.TDatumEnum = {}

for (const key in TDatumType) {
  if (TDatumType.hasOwnProperty(key)) {
    window.TDatumEnum[TDatumType[key]] = key;
  }
}

export {default as Thrifty} from "./src/thrifty"
