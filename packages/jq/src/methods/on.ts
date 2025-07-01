import { $ } from '../$.js';
import { add } from '../shared/event.js';
import {
  isString,
  isObjectLike,
  returnFalse,
  eachObject,
} from '../shared/helper.js';
import './each.js';
import './off.js';
import type { JQ } from '../shared/core.js';
import type { EventCallback } from '../shared/event.js';
import type { PlainObject } from '../shared/helper.js';

// 该方法也用于监听 ajaxStart, ajaxSuccess, ajaxError, ajaxComplete 事件
// 其中 ajaxStart, ajaxError, ajaxComplete 事件的回调函数第二个参数为 { xhr, options }
// ajaxSuccess 事件的回调函数的第二个参数为 { xhr, options, response }

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 通过事件委托同时添加多个事件处理函数
     * @param events
     * 一个对象：
     *
     * 键名为事件名，多个事件名用空格分隔，可包含命名空间；
     *
     * 键值为事件处理函数
     * @param selector CSS 选择器
     * @param data
     * 事件触发时，传递给事件处理函数的数据
     *
     * 如果 `data` 是 `string` 类型，则必须提供 `selector` 参数；`selector` 参数可以是 `null`
     */
    on<TData = unknown>(
      events: PlainObject<EventCallback<TData, T> | false>,
      selector: string | null | undefined,
      data?: TData,
    ): this;

    /**
     * 同时添加多个事件处理函数
     * @param events
     * 一个对象：
     *
     * 键名为事件名，多个事件名用空格分隔，可包含命名空间；
     *
     * 键值为事件处理函数
     * @param data
     * 事件触发时，传递给事件处理函数的数据
     *
     * 如果 `data` 是 `string` 类型，则必须提供 `selector` 参数；`selector` 参数可以是 `null`
     */
    on<TData = unknown>(
      events: PlainObject<EventCallback<TData, T> | false>,
      data?: TData,
    ): this;

    /**
     * 通过事件委托添加事件处理函数，并传入参数
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param selector CSS 选择器
     * @param data
     * 事件触发时，传递给事件处理函数的数据
     *
     * 如果 `data` 是 `string` 类型，则必须提供 `selector` 参数；`selector` 参数可以是 `null`
     * @param callback 事件处理函数
     */
    on<TData = unknown>(
      eventName: string,
      selector: string | null | undefined,
      data: TData,
      callback: EventCallback<TData, T> | false,
    ): this;

    /**
     * 通过事件委托添加事件处理函数
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param selector CSS 选择器
     * @param callback 事件处理函数
     */
    on(
      eventName: string,
      selector: string,
      callback: EventCallback<unknown, T> | false,
    ): this;

    /**
     * 添加事件处理函数，并传入参数
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param data 事件触发时，传递给事件处理函数的数据
     * @param callback 事件处理函数
     */
    on<TData = unknown>(
      eventName: string,
      data: TData,
      callback: EventCallback<TData, T> | false,
    ): this;

    /**
     * 添加事件处理函数
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param callback 事件处理函数
     */
    on(eventName: string, callback: EventCallback<unknown, T> | false): this;
  }
}

$.fn.on = function (
  this: JQ,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  types: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: any,
  one?: boolean, // 是否是 one 方法，只在 JQ 内部使用
): JQ {
  // types 可以是 type/func 对象
  if (isObjectLike(types)) {
    // (types-Object, selector, data)
    if (!isString(selector)) {
      // (types-Object, data)
      data = data || selector;
      selector = undefined;
    }

    eachObject(types, (type: string, fn: unknown) => {
      // selector 和 data 都可能是 undefined
      // @ts-ignore
      this.on(type, selector, data, fn, one);
    });

    return this;
  }

  if (data == null && callback == null) {
    // (types, fn)
    callback = selector;
    data = selector = undefined;
  } else if (callback == null) {
    if (isString(selector)) {
      // (types, selector, fn)
      callback = data;
      data = undefined;
    } else {
      // (types, data, fn)
      callback = data;
      data = selector;
      selector = undefined;
    }
  }

  if (callback === false) {
    callback = returnFalse;
  } else if (!callback) {
    return this;
  }

  // $().one()
  if (one) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const origCallback = callback;

    callback = function (
      this: Element | Document | Window,
      event: Event,
      ...dataN: unknown[]
    ): void {
      _this.off(event.type, selector, callback);

      return origCallback.call(this, event, ...dataN);
    };
  }

  return this.each(function () {
    add(this, types, callback, data, selector);
  });
};
