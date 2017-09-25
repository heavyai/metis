// @flow
import {dispatch} from "d3-dispatch"

const EVENTS = ["setup", "remove", "filter", "filterAll", "preRender", "postRender",  "preRedraw", "postRedraw"]

export interface ChartType<A, B> {
  id: A,
  node: B,
  dispatch: any,
  on(...params: any): void,
  filter(value: any): void,
  handleFilter(value: any): void,
  filterAll(): void,
  data(): Promise<any>,
  render(data: any): void,
  doRender(data: any, updater: any): void,
  redraw(data: any): void,
  doRedraw(data: any, updater: any): void,
}

export default class BaseChart<A, B> implements ChartType<A, B> {
  id: A
  node: B
  dispatch: any

  constructor (id: A, node: B) {
    this.id = id
    this.node = node
    this.dispatch = dispatch(...EVENTS)
  }

  on = (...params: any) => {
    this.dispatch.on(...params)
  }

  filter = (value: any): void => {
    this.handleFilter(value)
    this.dispatch.call("filter", this, value)
  }

  handleFilter (value: any): void {
    return
  }

  filterAll (): void {
    this.dispatch.call("filterAll")
  }

  data (): Promise<any> {
    return Promise.resolve()
  }

  render = (data: any): void => {
    this.dispatch.call("preRender")
    this.doRender(data, this.dispatch)
    this.dispatch.call("postRender")
  }

  doRender (data: any, updater: any): void {
    return
  }

  redraw = (data: any): void => {
    this.dispatch.call("preRedraw")
    this.doRedraw(data, this.dispatch)
    this.dispatch.call("postRedraw")
  }

  doRedraw (data: any, updater: any): void {
    return
  }
}
