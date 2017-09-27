// @flow
let CHART_ID_COUNTER = 0;

export interface DispatchType {
  on(event: string, handler: Function): void,
  call(event: string, context: any, value: any): void
}

export interface ChartType<A, B, C> {
  id: number,
  node: A,
  dispatch: B,
  group: C,
  on(...params: any): void,
  data(): Promise<any>,
  render(data: any): void,
  doRender(data: any, updater: any): void,
  redraw(data: any): void,
  doRedraw(data: any, updater: any): void
}

export default class Chart<A: HTMLElement, B: DispatchType, C: string>
  implements ChartType<A, B, C> {
  id: number;
  node: A;
  dispatch: B;
  group: C;

  constructor(node: A, dispatch: B, group: C) {
    this.id = CHART_ID_COUNTER++;
    this.node = node;
    this.group = group;
    this.dispatch = dispatch;
    dispatch.call("setup", this);
  }

  on = (event: string, handler: () => void) => {
    this.dispatch.on(event, handler);
  };

  data(): Promise<any> {
    return Promise.resolve();
  }

  render = (data: any): void => {
    this.dispatch.call("preRender", this, data);
    this.doRender(data, this.dispatch);
    this.dispatch.call("postRender", this, data);
  };

  doRender(data: any, updater: any): void {
    return;
  }

  redraw = (data: any): void => {
    this.dispatch.call("preRedraw", this, data);
    this.doRedraw(data, this.dispatch);
    this.dispatch.call("postRedraw", this, data);
  };

  doRedraw(data: any, updater: any): void {
    return;
  }
}
