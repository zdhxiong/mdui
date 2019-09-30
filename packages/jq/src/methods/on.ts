import $ from '../$';
import each from '../functions/each';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import { isFunction, isObjectLike, isString } from '../utils';
import './each';
import './off';
import { add } from './utils/event';

type EventCallback = (e: Event, data?: any) => void | false;

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 通过事件委托同时添加多个事件处理函数
     * @param events
     * @param selector
     * @param data
     */
    on(events: PlainObject<EventCallback>, selector: string, data?: any): this;

    /**
     * 同时添加多个事件处理函数
     * @param events
     * @param data
     */
    on(events: PlainObject<EventCallback>, data?: any): this;

    /**
     * 通过事件委托添加事件处理函数，并传入参数
     * @param eventName
     * @param selector
     * @param data 如果 data 是 string 类型，则必须提供 selector 参数；selector 参数可以是 null
     * @param callback
     */
    on(
      eventName: string,
      selector: string,
      data: any,
      callback: EventCallback,
    ): this;

    /**
     * 通过事件委托添加事件处理函数
     * @param eventName
     * @param selector
     * @param callback
     */
    on(eventName: string, selector: string, callback: EventCallback): this;

    /**
     * 添加事件处理函数，并传入参数
     * @param eventName
     * @param data
     * @param callback
     */
    on(eventName: string, data: any, callback: EventCallback): this;

    /**
     * 添加事件处理函数
     * @param eventName
     * @param callback
     */
    on(eventName: string, callback: EventCallback): this;
  }
}

$.fn.on = function(
  this: JQ,
  eventName: PlainObject<EventCallback> | string,
  selector: any,
  data?: any,
  callback?: any,
  one?: boolean, // 是否是 one 方法，只在 JQ 内部使用
): JQ {
  // eventName 是对象
  if (isObjectLike(eventName)) {
    each(eventName, (type: string, fn: EventCallback) => {
      // selector 和 data 都可能是 undefined
      // @ts-ignore
      this.on(type, selector, data, fn, one);
    });

    return this;
  }

  // selector 不存在
  if (selector && !isString(selector)) {
    callback = data;
    data = selector;
    selector = undefined;
  }

  // data 不存在
  if (isFunction(data)) {
    callback = data;
    data = undefined;
  }

  // $().one()
  if (one) {
    const origCallback: Function = callback;

    callback = (): void => {
      this.off(eventName, selector, callback);
      // eslint-disable-next-line prefer-rest-params
      return origCallback.apply(callback, arguments);
    };
  }

  return this.each(function() {
    add(this, eventName, callback, data, selector);
  });
};
