// @flow
import type {ChartType} from "./chart"
const chartGroups = new Map();

export const DEFAULT_GROUP_NAME = "DEFAULT_GROUP_NAME";

export default class View {
  register(chart: ChartType<string | number, HTMLElement>, groupName: string = DEFAULT_GROUP_NAME) {
    const group = chartGroups.get(groupName)
    return typeof group !== "undefined" && group instanceof Map
      ? group.set(chart.id, chart)
      : chartGroups.set(groupName, new Map().set(chart.id, chart));
  }

  list(groupName: string = DEFAULT_GROUP_NAME) {
    const group = chartGroups.get(groupName)
    return  typeof group !== "undefined" && group instanceof Map
      ? Array.from(group.values())
      : [];
  }
}
