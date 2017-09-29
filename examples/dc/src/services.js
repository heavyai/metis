import {Thrifty} from "../../../packages/thrift-layer";
import { createView } from "../../../packages/view-layer/src";
import { createDataGraph } from "../../../packages/data-layer";
import config from "../../config";

export const view = createView();
export const connector = new Thrifty(config);
const dataGraph = createDataGraph(connector);
const flightsDataGraph = dataGraph.data("tweets_nov_feb");
export const xfilterNode = flightsDataGraph.data({
  name: "xfilter",
  transform: [
    {
      type: "crossfilter",
      signal: "XFILTER",
      filter: {}
    }
  ]
});

connector.logger = (query, result) => {
  const loggingDiv = document.getElementById("logging")
  var newDiv = document.createElement("div")

  newDiv.className = "query"
  newDiv.innerHTML = `
    <span class="stmt">${query}</span>
    executed in
    <span class="time">${result.execution_time_ms}</span>
     ms
    `

  Array.from(loggingDiv.children).forEach(child => {
    child.className = "fade query"
  })

  setTimeout(() => {
    if (loggingDiv.children.length === 3) {
      loggingDiv.innerHTML = ""
    }
    loggingDiv.appendChild(newDiv);

  }, 600)

}
