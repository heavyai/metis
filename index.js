// @flow

/**
 * The exported module
 * @namespace API
 */

/**
  * Library type definitions are declared in the `flow-typed/` folder.
  * @namespace Types
  * @see {@link https://github.com/mrblueblue/sql-datagraph/blob/master/flow-typed/datagraph.flow.js|Data Graph Types}
  * @see {@link https://github.com/mrblueblue/sql-datagraph/blob/master/flow-typed/transform.flow.js|Transform Types}
  */

import write from "./src/sql/write-sql";
import { createDataGraph as createGraph } from "./src/data-graph";

export const writeSQL = write;
export const createDataGraph = createGraph;
