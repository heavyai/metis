// var nasdaqCount = dc.dataCount('#count-widget');
import { view, xfilterNode } from "./services";

export const dispatch = view.dispatch();

dispatch.on("preRedraw", function preRender([{records}]) {
  console.log(records)
  this.chart.group({value: () => records })
  this.chart.data(() => records);
});

dispatch.on("preRender", function preRender([{records}]) {
  this.chart.dimension({size: () => records })
  this.chart.group({value: () => records })

  this.chart.data(() => records);
});

dispatch.on("setup", function setup() {
  this.chart = dc
    .dataCount('#count-widget')
    ._mandatoryAttributes([])
    .html({
      some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
          ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a>',
      all: 'All records selected. Please click on the graph to apply filters.'
    });

  this.dataNode = xfilterNode.data({
    name: "pie",
    transform: [
      {
        type: "project",
        expr: "COUNT(*)",
        as: "records"
      },
      {
        type: "resolvefilter",
        filter: { signal: "XFILTER" }
      }
    ]
  });
});
