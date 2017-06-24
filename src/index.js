// @flow
import write from "./parser/write-sql";
import createGraph from "./create-data-graph";

import type {DataState} from "./create-data-node"
import type {Connector, DataGraph} from "./create-data-graph"

// declare module "mapd-data-layer" {
//   declare export function writeSQL(state: DataState): string
//   declare export function createDataGraph(connector: Connector): DataGraph
// }

/**
 * The exported module
 * @namespace API
 */
export const writeSQL = write;
export const createDataGraph = createGraph;
