import { connect } from "./src/connector";
import { dispatch } from "./src/chart-registry";
import createRow from "./src/chart-row";
import createScatter from "./src/chart-scatter";
import createLine from "./src/chart-line";
import createFacet from "./src/chart-facet";

connect()
  .then(() => {
    createRow();
    createScatter();
    createLine();
    createFacet();
    dispatch.call("renderAll");
  })
  .then(() => {
    document.getElementById("filter-all").addEventListener("click", () => {
      dispatch.call("filterAll");
    });
  });
