import $ from '../$';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import './on';

type EventCallback = (e: Event, data?: any) => void | false;

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 通过事件委托同时添加多个事件处理函数，触发一次后自动解绑
     * @param events
     * @param selector
     * @param data
     */
    one(events: PlainObject<EventCallback>, selector: string, data?: any): this;

    /**
     * 同时添加多个事件处理函数，触发一次后自动解绑
     * @param events
     * @param data
     */
    one(events: PlainObject<EventCallback>, data?: any): this;

    /**
     * 通过事件委托添加事件处理函数，并传入参数，触发一次后自动解绑
     * @param eventName
     * @param selector
     * @param data 如果 data 是 string 类型，则必须提供 selector 参数；selector 参数可以是 null
     * @param callback
     */
    one(
      eventName: string,
      selector: string,
      data: any,
      callback: EventCallback,
    ): this;

    /**
     * 通过事件委托添加事件处理函数，触发一次后自动解绑
     * @param eventName
     * @param selector
     * @param callback
     */
    one(eventName: string, selector: string, callback: EventCallback): this;

    /**
     * 添加事件处理函数，并传入参数，触发一次后自动解绑
     * @param eventName
     * @param data
     * @param callback
     */
    one(eventName: string, data: any, callback: EventCallback): this;

    /**
     * 添加事件处理函数，触发一次后自动解绑
     * @param eventName
     * @param callback
     */
    one(eventName: string, callback: EventCallback): this;
  }
}

$.fn.one = function(
  this: JQ,
  eventName: PlainObject<EventCallback> | string,
  selector: any,
  data?: any,
  callback?: any,
): JQ {
  // @ts-ignore
  return this.on(eventName, selector, data, callback, true);
};
