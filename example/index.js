import { connect } from "./src/connector";
import { dispatch } from "./src/chart-registry";
import createRow from "./src/chart-row";
import createScatter from "./src/chart-scatter";
import createLine from "./src/chart-line";

connect()
  .then(() => {
    createRow();
    createScatter();
    createLine();
    dispatch.call("renderAll");
  })
  .then(() => {
    document.getElementById("filter-all").addEventListener("click", () => {
      dispatch.call("filterAll");
    });
  });
