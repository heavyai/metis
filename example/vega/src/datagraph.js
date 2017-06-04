// @flow
import * as constants from "./constants";
import { createDataGraph } from "../../../src/data-graph";
import { query } from "./connector";

export default createDataGraph({ query, tables: ["flights_donotmodify"] });
