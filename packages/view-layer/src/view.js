// @flow
import * as d3 from "d3-dispatch";
import DefaultRegistry from "./registry";
import DefaultRenderer from "./renderer";
import type { DispatchType } from "./chart";
import type { RegistryType } from "./registry";

const BASE_EVENTS = [
  "setup",
  "remove",
  "filter",
  "filterAll",
  "preRender",
  "postRender",
  "preRedraw",
  "postRedraw"
];

export interface ViewType {
  registry: RegistryType,
  renderAll(group: string): Promise<any>,
  redrawAll(group: string): Promise<any>
}

export default function createView(
  Registry: Class<DefaultRegistry> = DefaultRegistry,
  Renderer: Class<DefaultRenderer> = DefaultRenderer
): ViewType {
  const registry = new Registry();
  const renderer = new Renderer();

  function redrawAll(group: string) {
    return renderer.redrawAll(registry.list(group));
  }

  function renderAll(group: string) {
    return renderer.renderAll(registry.list(group));
  }

  function filterAll(group: string) {
    registry.list(group).forEach(chart => {
      chart.dispatch.call("filterAll", this);
    });
    redrawAll(group);
  }

  function dispatch(events = []) {
    const listener = d3.dispatch(
      ...Array.from(new Set([...BASE_EVENTS, ...events]))
    );
    listener.on("setup.register", function setup() {
      registry.register(this, this.group);
    });
    listener.on("remove.deregister", function remove() {
      registry.deregister(this, this.group);
    });
    listener.on("filter.redraw", function filter() {
      redrawAll(this.group);
    });
    return listener;
  }

  return {
    dispatch,
    registry,
    renderAll,
    redrawAll,
    filterAll
  };
}
