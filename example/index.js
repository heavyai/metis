import { connect } from "./src/connector";
import { dispatch } from "./src/chart-registry";

connect()
  .then(() => dispatch.call("renderAll"))
  .then(() => {
    document.getElementById("filter-all").addEventListener('click', () => {
      dispatch.call("filterAll")
    })
  });
