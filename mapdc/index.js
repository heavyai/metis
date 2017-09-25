// @flow
import View from "./src/view"
import BaseChart from "./src/chart"
import {renderAll, redrawAll} from "./src/renderer"

import type {ChartType} from "./src/chart"

export const helpers = {
  View,
  BaseChart
}

export interface MapDCContext {
  view: any,
  createChart (node: HTMLElement, group: string): ChartType<string | number, HTMLElement>,
  renderAll (group?: string): Promise<any>,
  redrawAll (group?: string): Promise<any>,
}

export function init (): MapDCContext {
  let id = 0
  const view = new View()

  return {
    view,
    createChart (node, group) {
      const Chart =  new BaseChart(id++, node)
      view.register(Chart, group)
      Chart.on("filter.redrawGroup", function redrawGroup () {
        redrawAll(view.list(group))
      })
      return Chart
    },
    filterAll (group: string) {
      view.list(group).forEach(chart => chart.filterAll())
      redrawAll(view.list(group))
    },
    redrawAll (group?: string) {
      return redrawAll(view.list(group))
    },
    renderAll (group?: string) {
      return renderAll(view.list(group))
    }
  }
}
