import $ from '../$';
import each from '../functions/each';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import { isObjectLike, isString, returnFalse } from '../utils';
import './each';
import './off';
import { EventCallback, add } from './utils/event';

declare module '../JQ' {
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
    on(
      events: PlainObject<EventCallback | false>,
      selector: string | null | undefined,
      data?: any,
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
    on(events: PlainObject<EventCallback | false>, data?: any): this;

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
    on(
      eventName: string,
      selector: string | null | undefined,
      data: any,
      callback: EventCallback | false,
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
      callback: EventCallback | false,
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
    on(eventName: string, data: any, callback: EventCallback | false): this;

    /**
     * 添加事件处理函数
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param callback 事件处理函数
     */
    on(eventName: string, callback: EventCallback | false): this;
  }
}

$.fn.on = function (
  this: JQ,
  types: PlainObject<EventCallback | false> | string,
  selector: any,
  data?: any,
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

    each(types, (type: string, fn: EventCallback | false) => {
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
    const origCallback: Function = callback;

    callback = function (
      this: Element | Document | Window,
      event: Event,
    ): void {
      _this.off(event.type, selector, callback);

      // eslint-disable-next-line prefer-rest-params
      return origCallback.apply(this, arguments);
    };
  }

  return this.each(function () {
    add(this, types, callback, data, selector);
  });
};
