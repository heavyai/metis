// @flow
import type { ChartType, DispatchType } from "./chart";

export interface RegistryType {
  register(
    chart: ChartType<HTMLElement, DispatchType, string>,
    groupName: string
  ): void,
  deregister(
    chart: ChartType<HTMLElement, DispatchType, string>,
    groupName: string
  ): void,
  list(groupName: string): Array<ChartType<HTMLElement, DispatchType, string>>
}

const chartGroups = new Map();
const DEFAULT_GROUP_NAME = "DEFAULT_GROUP_NAME";

export default class Registry implements RegistryType {
  register(
    chart: ChartType<HTMLElement, DispatchType, string>,
    groupName: string = DEFAULT_GROUP_NAME
  ) {
    const group = chartGroups.get(groupName);
    typeof group !== "undefined" && group instanceof Map
      ? group.set(chart.id, chart)
      : chartGroups.set(groupName, new Map().set(chart.id, chart));
  }

  deregister(
    chart: ChartType<HTMLElement, DispatchType, string>,
    groupName: string = DEFAULT_GROUP_NAME
  ) {
    const group = chartGroups.get(groupName);
    if (group) {
      group.delete(chart.id);
    }
  }

  list(groupName: string = DEFAULT_GROUP_NAME) {
    const group = chartGroups.get(groupName);
    return typeof group !== "undefined" && group instanceof Map
      ? Array.from(group.values())
      : [];
  }
}
